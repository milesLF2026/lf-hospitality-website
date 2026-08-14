# LI & FUNG HOSPITALITY 酒店用品网站 — 使用与更新说明

这是一个纯静态网站（无需服务器、无需数据库），双击 `index.html` 即可在浏览器打开预览；
也可整个文件夹上传到任何静态托管（如 GitHub Pages、Vercel、Netlify、阿里云 OSS、腾讯云 COS）直接上线。

## 文件结构

```
miles-hotel-supplies/
├── index.html          网页结构（一般不用改）
├── styles.css          样式（改颜色、字体才动）
├── app.js              渲染逻辑（一般不用改）
├── data/
│   └── catalog.js      ★ 所有文字和产品数据都在这里改 ★
└── images/
    └── uniform/        ★ 服装产品图片放这里 ★
```

## 日常更新只需要两步

### 1. 添加/替换产品图片
把图片文件（jpg/png，建议 4:3 横图、≤500KB）放进 `images/uniform/` 文件夹。

### 2. 编辑 `data/catalog.js`
用记事本/文本编辑器打开，在 `products: [ ... ]` 里复制一个现有产品块，改内容：

```js
{
  name: "Waiter / Waitress Vest Set",        // 产品名（英文）
  category: "Hotel Uniform",                  // 所属分类，先保持不动
  image: "images/uniform/你的图片名.jpg",     // 图片路径，和第1步文件名一致
  description: "一句话简介",
  specs: {                                    // 参数表，可增删行
    Fabric: "Polyester twill",
    Sizes: "XS – 4XL",
    MOQ: "50 pcs",
  },
},
```

注意：每个产品块结尾要有逗号；引号不要删。

- 删除产品：删掉整个 `{ ... },` 块即可。
- 修改公司邮箱：改文件顶部 `company.email`。
- 修改分类名称/简介：改 `categories` 部分。

### 3. 以后某个品类（如 F&B）也要展示产品时
1. 在 `images/` 下新建对应文件夹（如 `images/fnb/`）放图片；
2. 在 `catalog.js` 里把该分类的 `live: false` 改为 `live: true`；
3. 在 `products` 里添加产品，`category` 填该分类的英文名（如 `"F&B Equipment & Supplies"`）；
4. 如需调整页面结构（每个 live 分类一个板块），联系我即可。

## 当前状态（第一阶段）
- ✅ 首页 + 公司介绍 + 联系方式
- ✅ Hotel Uniform 完整产品展示（6 个示例产品，含图片和参数，可点击看详情）
- ✅ 其余 5 个一级分类以目录形式展示（含全部 20 个二级品类）
- 示例图片为 AI 生成占位图，换成实拍图只需替换 `images/uniform/` 里的同名文件，**数据文件不用改**
