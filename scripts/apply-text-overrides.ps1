Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$path = "assets/index-BUkr1E8S.js"
$s = Get-Content -Raw $path

function Replace-Literal {
  param(
    [string]$Old,
    [string]$New
  )
  if ($s.Contains($Old)) {
    $script:s = $script:s.Replace($Old, $New)
  } else {
    Write-Warning "Pattern not found: $Old"
  }
}

Replace-Literal 'y("about.description1")' '"RA Architects上海锐点建筑设计有限公司/上海照度建筑设计事务所是一间建筑师事务所性质的专业设计公司，由饶青先生于2001年与合伙人共同创立，长期以创意型公司的形式在上海开展工作。公司设有建筑与景观两个设计部门，团队规模控制在60人以内。"'
Replace-Literal 'y("about.description2")' '"公司致力于建立由广泛社会资源支持的开放设计平台，并与境内外多位知名建筑师及艺术家协作。团队深度参与从市场定位、开发建设到后期营销的全过程，实现建筑设计与房地产运营的无缝对接。"'
Replace-Literal 'y("about.description3")' '"自2009年以来，团队在精品住宅及豪华度假酒店项目上积累了丰富经验。公司坚持主创设计师全程参与与实施控制，强调“建筑师负责制”，以确保创新表达与项目完成度同步落地。"'

Replace-Literal '"Shanghai ONE PARK GUBEI"' '"奖项及荣誉"'
Replace-Literal '`Awarded "Asia''s Best Property Award" in 2015.`' '"2015 上海·古北壹号（获2015年亚洲最佳物业奖；获2015年诺金盘奖年度最佳公寓）。"'
Replace-Literal '''Awarded "Annual Best Apartment" at the 2015 Nobility Awards.''' '"“亚洲最佳物业奖”是亚洲区权威房地产奖项，自2005年举办以来，被称为亚洲地产界“奥斯卡”。"'
Replace-Literal '`The "Asia''s Best Property Award" is an authoritative real estate award in the Asia-Pacific region. Since its inception in 2005, it has been considered the "Oscar" ceremony of the Asian real estate industry. The professionalism and impartiality of the award are second to none in the Asia-Pacific region, and winning the award undoubtedly represents the highest level in the field.`' '"2015年项目同时获“最佳住宅（上海）—优异奖”，代表亚洲顶级豪宅建筑设计服务水准。"'
Replace-Literal '''In 2015, the project was also honored with the "Best Residential Development (Shanghai) - Excellent Award," representing the top-notch architectural design and service level of luxury homes in Asia.''' '"其他代表奖项：2007无锡凤凰城（全国建设部人居经典综合大奖）；2006尚东国际名园（上海市住宅设计单体创优优良奖）；2005欧泊圣堡（上海园林景观建筑大赛综合大奖、IACE2006国际人居范例金奖）等。"'

Replace-Literal 'y("contact.title")' '"联系我们"'
Replace-Literal 'y("contact.subtitle")' '"Get in touch with us"'
Replace-Literal 'y("contact.china.title")' '"中国"'
Replace-Literal 'y("contact.china.address")' '"上海市海防路555号，同乐坊12号楼"'
Replace-Literal 'y("contact.china.email")' '"ra_design@126.com"'
Replace-Literal 'y("contact.china.phone")' '"021-62473655"'

Set-Content -Path $path -Value $s -NoNewline
Write-Host "Applied text overrides in $path"
