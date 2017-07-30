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

/**
 * 返回paper中各种类型题目的开始标志index
 */
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

/**
* 工具函数，检查该组试题是否已经做完
*/
function checkAnswer (answer, size) {
  if (answer.length < size) return false;
  for (var i = 0; i < answer.length; i++) {
    if (answer[i] == undefined) {
      return false;
    }
  }
  return true;
}

/**
 * 工具函数，格式化上传数据
 */
function formatAnswer (titleList, answer) {
  for (var i = 0; i < titleList.length; i++) {
    for (var j = 0; j < titleList[i].options.length; j++) {
      titleList[i].options[j].checked = 0;
    }
    if (answer[i] == undefined) continue;
    titleList[i].options[answer[i] - 1].checked = 1;
  }
  return titleList;
}

/**
 * 工具函数，格式化填空题答案，每个答案之间用#分隔，
 * 如果答案为空用@csu代替
 */
function formatBAnswer (blanksList, answer, first, fillsCount) {
  for (var i = 0; i < blanksList.length; i++) {
    var fillCount = fillsCount[i].length;
    var blanks = answer[first + i];
    var str = "";
    for (var j = 1; j <= fillCount; j++) {
      if (blanks == undefined || blanks[j] == undefined || blanks[j] == "") {
        str += '#@csu';
      } else {
        str += '#' + blanks[j];
      }
    }
    str = str.substring(1, str.length);
    blanksList[i].answer = str;
  }
  return blanksList;
}

/**
 * 工具函数，格式化判断题答案，正选为1，反选为0，不选为-1
 */
function formatJAnswer (judgeList, answer, first) {
  for (var i = 0; i < judgeList.length; i++) {
    if (answer[first + i] == undefined || answer[first + i] == "") {
      judgeList[i].answer = -1;
    } else {
      judgeList[i].answer = answer[first + i];
    }
  }
  return judgeList;
}

/**
 * 工具函数，格式化问答题答案
 */
function formatQAnswer (answer, first, size) {
  var str = "";
  for (var i = 0; i < size; i++) {
    if (answer[first + i] == undefined || answer[first + i] == "") {
      str += '#@csu';
    } else {
      str += '#' + answer[first + i];
    }
  }
  str = str.substring(1, str.length);
  return str;
}

module.exports = {
  size: size,
  initList: initList,
  nextList: nextList,
  startSign: startSign,
  prevList: prevList,
  checkAnswer: checkAnswer,
  formatAnswer: formatAnswer,
  formatBAnswer: formatBAnswer,
  formatJAnswer: formatJAnswer,
  formatQAnswer: formatQAnswer,
}