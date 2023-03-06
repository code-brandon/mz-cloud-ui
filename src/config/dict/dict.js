import Vue from 'vue'
// 引入自己获取字典的接口
import {getDictDataByType } from '@/api/system/dict'

export default class Dict {
  constructor(dict) {
    this.dict = dict
  }

  async init(names, completeCallback) {
    if (names === undefined || name === null) {
      throw new Error('need Dict names')
    }
    const ps = []
    names.forEach(n => {
      // 根据自己的需求可以自定义格式储存，一般只保留 Vue.set(this.dict, n, []) 就可以，下面与上面对应
      Vue.set(this.dict.dict, n, {})
      Vue.set(this.dict.label, n, {})
      Vue.set(this.dict, n, [])
      ps.push(getDictDataByType(n).then(({ data: res })=> {
        this.dict[n].splice(0, 0, ...res.data)
        res.data.forEach(d => {
          /**
           * dictLabel 更改为自己字典的key 就是要显示的文字
           * dictValue 更改为自己字典的value 就是要传的参数
           * 例如 你获取道德数据为 { name:"蓝色"，id："1"}
           * 则 dictLabel 为name, dictValue 为id
           */
          Vue.set(this.dict.dict[n], d.dictValue, d)
          Vue.set(this.dict.label[n], d.dictValue, d.dictLabel)
        })
      }))
    })
    await Promise.all(ps)
    completeCallback()
  }
}
