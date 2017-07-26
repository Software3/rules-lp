/**
 * 获得paper对象中题目总数
 */
function size(paper) {
  var size = 0;
  for (var key in paper) {
    size += paper[key].length;
  }
  return size;
}

/**
 * 获得paper对象中第一个可操作的题目List
 */
function initList(paper) {
  var type = 0;
  for (var key in paper) {
    if (paper[key].length != 0) {
      return [paper[key], type];
    }
    type++;
  }
}
/**
 * 获取paper对象中上一个可以使用的type
 */
function prevList(paper, ctype) {
  var keyset = [];
  for (var key in paper) {
    keyset.push(key);
  }
  for (var i = ctype - 1; i >= 0; i--) {
    if (paper[keyset[i]].length != 0) {
      return [paper[keyset[i]], i]
    }
  }
  return [[], -1];
}
/**
 * 获取paper对象中下一个可以使用的type
 */
function nextList(paper, ctype) {
  var keyset = [];
  for (var key in paper) {
    keyset.push(key);
  }
  for (var i = ctype+1; i < keyset.length;i++) {
    if (paper[keyset[i]].length != 0) {
      return [paper[keyset[i]], i]
    }
  }
  // 没找到
  return [[],-1];
}

function startSign(paper) {
  var sign = [];
  sign.push(0);
  var keyset = [];
  for (var key in paper) {
    keyset.push(key);
  }
  for (var i =  0; i < keyset.length - 1; i++) {
    sign[i+1] = sign[i] + paper[keyset[i]].length;
  }
  return sign;
} 
module.exports = {
  size: size,
  initList: initList,
  nextList: nextList,
  startSign: startSign,
  prevList: prevList,
}