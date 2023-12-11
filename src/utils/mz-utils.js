/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^[h|H]ttp[s]?:\/\/.*/.test(s)
}

/**
 * 判断对象是否有空值
 * @param {*} params 
 * @returns flag
 */
export function paramsValidate (params) {
  let flag = Object.keys(params).length > 0;
  for(var key in params){
    if(!params[key] || params[key] == null || params[key] == ''){
      return false; // 终止程序
    }
  }
  return flag;
}


/**
 * 深比较两个对象是否相等
 * @param {*} obj1 
 * @param {*} obj2 
 * @returns 
 */
export function deepEqual(obj1, obj2) {
  // 如果两个对象引用相同，则它们一定相等
  if (obj1 === obj2) {
    return true;
  }

  // 如果两个对象的类型不同，则它们一定不相等
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }

  // 如果两个对象的键值对数量不同，则它们一定不相等
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  // 检查每个键值对是否相等
  for (let key in obj1) {
    // 递归调用deepEqual来比较对应的值
    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  // 如果所有的键值对都相等，则两个对象相等
  return true;
}

/**
 * 数组分割
 * @param {*} array 要分割的数组
 * @param {*} subGroupLength  每个分片的数量
 * @returns 
 */
export function arrayGroup(array, subGroupLength) {
  let index = 0;
  let newArray = [];
  while(index < array.length) {
      newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
}
