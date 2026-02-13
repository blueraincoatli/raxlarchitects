param(
  [string]$Root = "images",
  [int]$AvifCrf = 38,
  [int]$WebpQuality = 72,
  [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Invoke-Convert {
  param(
    [string]$InputPath,
    [string]$OutputPath,
    [string[]]$Args
  )

  $input = Get-Item $InputPath
  if (
    -not $Force -and
    (Test-Path $OutputPath) -and
    ((Get-Item $OutputPath).LastWriteTimeUtc -ge $input.LastWriteTimeUtc)
  ) {
    return
  }

  & ffmpeg -hide_banner -loglevel error -y -i $InputPath @Args $OutputPath
  if ($LASTEXITCODE -ne 0) {
    return $false
  }
  return $true
}

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  throw "ffmpeg is required but not found."
}

$sourceExt = @(".jpg", ".jpeg", ".png")
$files = Get-ChildItem -Recurse -File $Root | Where-Object {
  $sourceExt -contains $_.Extension.ToLowerInvariant()
}

Write-Host "Found $($files.Count) source images under $Root"
$failed = New-Object System.Collections.Generic.List[string]

foreach ($file in $files) {
  $base = [System.IO.Path]::Combine($file.DirectoryName, [System.IO.Path]::GetFileNameWithoutExtension($file.Name))
  $ext = $file.Extension.ToLowerInvariant()

  # Keep a JPG fallback for PNG sources to allow a non-PNG original fallback path when needed.
  if ($ext -eq ".png") {
    $jpg = "$base.jpg"
    $okJpg = Invoke-Convert -InputPath $file.FullName -OutputPath $jpg -Args @(
      "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p",
      "-q:v", "3",
      "-frames:v", "1"
    )
    if (-not $okJpg) {
      $failed.Add($file.FullName)
      Write-Warning "Skip invalid image: $($file.FullName)"
      continue
    }
  }

  $webp = "$base.webp"
  $okWebp = Invoke-Convert -InputPath $file.FullName -OutputPath $webp -Args @(
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-c:v", "libwebp",
    "-q:v", "$WebpQuality",
    "-compression_level", "6",
    "-preset", "picture",
    "-frames:v", "1"
  )
  if (-not $okWebp) {
    $failed.Add($file.FullName)
    Write-Warning "Skip invalid image: $($file.FullName)"
    continue
  }

  $avif = "$base.avif"
  $okAvif = Invoke-Convert -InputPath $file.FullName -OutputPath $avif -Args @(
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-c:v", "libaom-av1",
    "-still-picture", "1",
    "-crf", "$AvifCrf",
    "-b:v", "0",
    "-cpu-used", "6",
    "-frames:v", "1"
  )
  if (-not $okAvif) {
    $failed.Add($file.FullName)
    Write-Warning "Skip invalid image: $($file.FullName)"
  }
}

Write-Host "Variant generation complete."
if ($failed.Count -gt 0) {
  Write-Host "Failed files: $($failed.Count)"
  $failed | Sort-Object -Unique | ForEach-Object { Write-Host $_ }
}
