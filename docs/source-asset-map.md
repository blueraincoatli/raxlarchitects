# Source Asset Map (0406-发出版本)

This file maps the source package at `20260212-网站资料整理/0406-发出版本` to current website pages, so content and image updates can be done page-by-page.

## Home (`/`)
- Source folder: `2-首页banner/`
- Source files:
  - `01-古北壹号.jpg`
  - `02-古北壹号.jpg`
  - `03-古北壹号.jpg`
  - `04-华山公寓.png`
  - `05-华山公寓.jpg`
  - `06-华山公寓.JPG`
- Current runtime targets:
  - `images/home/01-gubei.jpg` ... `images/home/06-huashan.*`
  - `images/home/m-01-gubei.jpg` ... `images/home/m-06-huashan.jpg`

## Projects (`/projects`, `/projects/:id`)
- Source folder: `3-项目/`
- Project source groups:
  - `1-古北壹号【已建成+建筑+景观】`
  - `2-华山公寓【已建成+建筑】`
  - `3-尚东鼎【已建成+建筑+景观】`
  - `4-杭州融信【已建成+建筑】`
  - `5-安吉度假别墅【提案+建筑】`
  - `6-品尊国际（三期）【建设中+建筑】`
  - `7-开云·艾尚里【建设中+建筑】`
  - `8-新湖·天虹【建设中+建筑】`
  - `9-chairclub【已建成+室内】`
  - `10-content office&shop【已建成+室内】`
  - `11-content show【其他】`
- Current runtime targets:
  - `images/projects/*.jpg|*.png|*.jpeg`
  - `images/original/projects/*` (archive/original copies)
- Project text source: each project folder's `*.docx`/`*.doc` "项目信息" file.

## About (`/about`, `/about/partners`, `/about/awards`)
- Source folders:
  - `4-关于/` (`简介.jpg`, `RA简介.docx`)
  - `5-饶+廖/` (`简介.jpg`, `1-RAO/RAO.docx`, `2-LIAO/设计师介绍.doc`)
  - `6-奖项/` (`奖项荣誉.jpg`, `奖项及荣誉.docx`)
- Current runtime targets:
  - `images/about/hero.jpg`, `images/about/partner1.jpg`, `images/about/partner2.jpg`, `images/about/award.jpg`
- Text source:
  - About intro from `RA简介.docx`
  - Founder bios from `RAO.docx` and `设计师介绍.doc`
  - Awards text from `奖项及荣誉.docx`

## Contact (`/contact`)
- Source folder: `7-联系我们/`
- Text source: `联系我们.docx`
- Current runtime: i18n text values rendered in contact page.

## Variant Policy Implemented
- Image delivery priority now targets: `avif` -> `webp` -> original.
- For original `.png` sources, `.jpg` fallback assets are generated when possible.
- Batch generation script: `scripts/generate-image-variants.ps1`
