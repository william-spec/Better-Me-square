//*****************************获取数据并创建内容框
function createDiv(width = '200px', height = ''){   //创建包裹Div框
  let div = document.createElement('div');
  div.className = 'item';
  div.style.width = width;
  div.style.backgroundColor = '#F5F5F6';
  div.style.borderRadius = '10%';
  div.style.overflow = 'hidden';
  div.style.height = height;
  div.style.position = 'absolute';
  div.onclick = jumpToDetail;
  itemWidth = parseInt(width);
  return div;
}

function createDivText(text){   //创建顶部文字内容
  let divText = document.createElement('div');
  divText.style.width = '100%';
  divText.style.boxSizing = 'border-box';
  divText.style.wordBreak = 'break-all';
  divText.style.textAlign = 'left';
  divText.style.padding = '5px 5px';
  divText.style.fontSize = '13px';
  divText.style.backgroundColor = '#A8DBFD';
  divText.innerText = text;
  return divText;
}

function createDivImg(src){    //晒进度
  let divImg = document.createElement('div');
  divImg.className = 'img';
  divImg.style.width = '100%';
  divImg.style.height = 100 + 'px';
  divImg.style.display = 'block';
  divImg.style.boxSizing = 'border-box';
  divImg.style.border = '1px solid gray';
  divImg.style.backgroundSize =  divImg.style.width + ' 100px' ;
  
  divImg.setAttribute('data-src', 'url(' + src + ')');   //先将src保存下来
  return divImg;
}

function createDetailDiv(){   //创建底部框（用户，评论等）
  let detailDiv = document.createElement('div');
  detailDiv.style.position = 'relative';
  detailDiv.style.height = '38px';
  return detailDiv;
}

function createUserPhoto(src, width = '30px', top = '2px', left = '2px'){   //创建用户头像
  let userPhoto = document.createElement('div');
  userPhoto.className = 'img';
  userPhoto.style.width = width;
  userPhoto.style.height = width;
  userPhoto.style.borderRadius = '50%';
  userPhoto.style.border = '1px solid black';
  userPhoto.style.position = 'absolute';
  userPhoto.style.top = top;
  userPhoto.style.left = left;
  userPhoto.style.backgroundSize = width + ' ' + width ;
  userPhoto.setAttribute('data-src', 'url(' + src + ')');   //先将src保存下来
  return userPhoto;
}

function createUserName(text, email, left = '37px', top = '2px', fontSize = '10px'){    //创建用户名
  let userName = document.createElement('div');
  userName.style.position = 'absolute';
  userName.innerText = text;
  userName.style.fontSize = fontSize;
  userName.style.top = top;
  userName.style.left = left;
  userName.style.cursor = 'pointer';
  userName.setAttribute('data-email', email);
  userName.onclick = jumpToUserPost;   //跳到个人发布页
  return userName;
}

function createUserContent(content, line = '2', left = '37px', bottom = '2px', fontSize = '10px'){    //创建用户个性签名
  let userContent = document.createElement('div');
  userContent.style.position = 'absolute';
  userContent.innerText = content;
  userContent.style.fontSize = fontSize;
  userContent.style.bottom = bottom;
  userContent.style.left = left;
  userContent.style.wordBreak = 'break-all';
  userContent.style.overflow = 'hidden';
  userContent.style.textOverflow = 'ellipsis';
  userContent.style.display = '-webkit-box';
  userContent.style.webkitBoxOrient = 'vertical';
  userContent.style.webkitLineClamp = line;
  return userContent;
}

function createUpdateTime(update, fontSize = '10px', top = '2px', right = '7px'){    //创建发布时间
  let updateTime = document.createElement('div');
  updateTime.style.position = 'absolute';
  updateTime.innerText = update;
  updateTime.style.fontSize = fontSize;
  updateTime.style.top = top;
  updateTime.style.right = right;
  return updateTime;
}

function createComments(data){    //创建评论
  let comments = document.createElement('div');
  comments.innerHTML = `
    <i style= 'font-size: 14px;' class="fa fa-commenting-o" 
    aria-hidden="true"></i>
  `;
  comments.innerHTML += `
    <div style= 'border: none; font-size: 10px; 
    display: inline-block; width: 25px; width: 25px; position: relative;
    top: 4px; overflow: hidden; white-space: nowrap; 
    text-overflow: ellipsis;'>`
      + data.commentsNum +
    `</div>
  `;
  comments.style.position = 'absolute';
  comments.style.top = 15 + 'px';
  comments.style.right = 7 + 'px';
  comments.setAttribute('data-obj', JSON.stringify(data));
  comments.style.cursor = 'pointer';
  comments.style.boxSizing = 'border-box';
  comments.onclick = jumpToDetail;    //跳到评论页
  return comments;
}

function createStars(starsNum, fontSize = '10px', top = '15px', right = '55px', numberTop = '3px'){   //创建点赞
  let stars = document.createElement('div');
  stars.innerHTML = `
    <i style= 'font-size: ` + fontSize + `;' class="fa fa-heart-o" 
    aria-hidden="true"></i>
  `;
  stars.innerHTML += `
    <div style= 'border: none; font-size:` + fontSize + `; 
    display: inline-block; width: 30px; position: relative;
    top: ` + numberTop + `; overflow: hidden; white-space: nowrap; 
    text-overflow: ellipsis;'>`
      + starsNum +
    `</div>
  `;
  stars.style.position = 'absolute';
  stars.id = 'createStars';
  stars.style.top = top;
  stars.style.right = right;
  stars.style.cursor = 'pointer';
  stars.style.boxSizing = 'border-box';
  stars.onclick = addStarsNumber;    //增加点赞数
  return stars;
}

function jumpToUserPost(){    //跳到个人发布页
  // 获取该用户信息，跳到该用户主页
  window.location.href = './userPost.html?user=' + this.innerText + '&email=' + this.getAttribute('data-email');  //点击用户名将用户名包含在url中传到个人发布页面
  event.stopPropagation();    //阻止事件进一步冒泡
}

function addStarsNumber(){
  let num = this.children[1].innerText;
  this.children[1].innerText = ++num;
  event.stopPropagation();    //阻止事件进一步冒泡
}

function jumpToDetail(){
  // 跳转到详情页，可以编辑评论等
  window.location.href = './detailContent.html?obj=' + 
                        this.getAttribute('data-obj')
                        ;  //点击评论将该用户email和帖子id包含在url中传到个人发布页面
                        event.stopPropagation();    //阻止事件进一步冒泡
}

function ajaxSend(req, deal){    //使用ajax发送请求获取数据库数据
  let xhr = new XMLHttpRequest();
  xhr.open(req.method, req.url, req.async);
  xhr.onreadystatechange = function(e){
    if(xhr.readyState === 4 && xhr.status === 200){
      deal(JSON.parse(xhr.responseText).result);   //处理返回数据
    }
  }
  xhr.send(JSON.stringify(req)/* 将JSON对象转换成字符串发送 */);
}

function getTime(){
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return year + '-' + month + '-' + day;
}