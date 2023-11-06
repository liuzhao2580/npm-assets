// 获取输入
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question("输入版本发布命令(patch/minor/major)", type => {
  // 更新版本号
  const { version } = require("../package.json")
  let newVersion = ""
  switch (type) {
    // 1.0.0 => 1.0.1
    case "patch":
      newVersion = version.replace(
        /(\d+\.)(\d+\.)(\d+)/,
        (match, p1, p2, p3) => {
          return p1 + p2 + (Number(p3) + 1)
        }
      )
      break
    // 1.0.0 => 1.1.0
    case "minor":
      newVersion = version.replace(/(\d+\.)(\d+)\./, (match, p1, p2) => {
        return p1 + (Number(p2) + 1) + "."
      })
      break
    // 1.0.0 => 2.0.0
    case "major":
      newVersion = version.replace(/(\d+)/, match => {
        return Number(match) + 1
      })
      break
  }
  // 修改package.json中的版本号
  const pkg = require("../package.json")
  pkg.version = newVersion
  require("fs").writeFileSync("./package.json", JSON.stringify(pkg, null, 2))

  // // 提交并推送到GitHub
  require('child_process').execSync('git add . && git commit -m "release: '+ newVersion +'"');
  require('child_process').execSync('git push');

  // // 发布到npm
  require('child_process').execSync('npm publish');

  readline.close()
})
