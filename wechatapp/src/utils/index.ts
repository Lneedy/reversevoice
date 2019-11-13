import Taro from '@tarojs/taro'

export { default as dateFormat } from './dateFormat'

export type ShowToastParam = {
  title: string
  icon?: string
  image?: string
  duration?: number
  mask?: boolean
  success?: (res: any) => any
  fail?: (err: any) => any
  complete?: () => any
}

// 重写 toast 的 complete 方法
export const showToast = ({ complete, duration = 1500, ...args }: ShowToastParam) => {

  Taro.showToast({ ...args })

  complete && setTimeout(complete, duration)
}

// catch promise error
export const cError = async (fn: Promise<any>): Promise<[null | { msg: string, code: number | string }, any]> => {
  try {
    const result = await fn
    return [null, result]
  } catch (error) {
    return [error, error]
  }
}

// 价格处理
export const priceToFloat = (price?: number): string => price ? price.toFixed(2) : ''

// 设置购物车小红点
export const setCartBadge = () => {
  try {
    const { shopNum } = Taro.getStorageSync('shopCartInfo') || {}
    if (shopNum && shopNum > 0) {
      Taro.setTabBarBadge({
        index: 2,
        text: String(shopNum),
      })
    } else {
      Taro.removeTabBarBadge({
        index: 2,
      })
    }
  } catch (error) {

  }
}

// valueEqual from https://www.npmjs.com/package/value-equal
const valueOf = (obj: any) => obj.valueOf ? obj.valueOf() : Object.prototype.valueOf.call(obj)

export const valueEqual = (a: any, b: any): boolean => {
  // Test for strict equality first.
  if (a === b) return true

  // Otherwise, if either of them == null they are not equal.
  if (a == null || b == null) return false

  if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every(function (item, index) {
        return valueEqual(item, b[index])
      })
    )
  }

  if (typeof a === 'object' || typeof b === 'object') {
    var aValue = valueOf(a)
    var bValue = valueOf(b)

    if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue)

    return Object.keys(Object.assign({}, a, b)).every(function (key) {
      return valueEqual(a[key], b[key])
    })
  }

  return false
}

// 处理0补全 11,0000 => 0011
export const zeroSubstr = (num: number, length: number) => (Array(length).join('0') + num).slice(-length)

export const getCurrentPageUrl = (): string => {
  var pages = Taro.getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}


// 获取倒计时时间展示字符串
export const getTimeStr = (time: number) => {
  const s = zeroSubstr(parseInt('' + (time / 1000) % 60), 2)
  const ms = zeroSubstr(parseInt('' + time % 1000 / 10), 2)
  return {
    s,
    ms,
    str: `${s}:${ms}`,
  }
}
