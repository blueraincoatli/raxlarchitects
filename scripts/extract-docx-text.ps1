param(
  [string]$SourceRoot = "20260212-网站资料整理/0406-发出版本",
  [string]$OutputRoot = "content/source-text"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-DocxText {
  param([string]$DocxPath)

  $zip = [System.IO.Compression.ZipFile]::OpenRead($DocxPath)
  try {
    $entry = $zip.Entries | Where-Object { $_.FullName -eq "word/document.xml" } | Select-Object -First 1
    if (-not $entry) { return "" }
    $stream = $entry.Open()
    try {
      $reader = New-Object System.IO.StreamReader($stream)
      $xmlRaw = $reader.ReadToEnd()
      $reader.Close()
    } finally {
      $stream.Dispose()
    }
  } finally {
    $zip.Dispose()
  }

  [xml]$xml = $xmlRaw
  $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
  $ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
  $paragraphs = $xml.SelectNodes("//w:p", $ns)
  $lines = New-Object System.Collections.Generic.List[string]
  foreach ($p in $paragraphs) {
    $texts = $p.SelectNodes(".//w:t", $ns)
    if ($texts.Count -eq 0) {
      $lines.Add("")
      continue
    }
    $line = ($texts | ForEach-Object { $_.InnerText }) -join ""
    $lines.Add($line)
  }
  return ($lines -join [Environment]::NewLine)
}

$src = Resolve-Path $SourceRoot
New-Item -ItemType Directory -Path $OutputRoot -Force | Out-Null
$out = Resolve-Path $OutputRoot

$docxFiles = Get-ChildItem -Recurse -File $src | Where-Object { $_.Extension -ieq ".docx" }
Write-Host "Found $($docxFiles.Count) docx files."

foreach ($file in $docxFiles) {
  $rel = [System.IO.Path]::GetRelativePath($src.Path, $file.FullName)
  $outPath = Join-Path $out.Path ($rel -replace "\.docx$", ".txt")
  $outDir = Split-Path -Parent $outPath
  New-Item -ItemType Directory -Path $outDir -Force | Out-Null
  $text = Get-DocxText -DocxPath $file.FullName
  Set-Content -Path $outPath -Value $text -Encoding UTF8
}

Write-Host "Extract complete: $($out.Path)"
