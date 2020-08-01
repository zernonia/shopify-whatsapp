var callback = () => {
  var currentScript = document.currentScript.src
  var urlParams = currentScript.split('?')[1]
  var params = new URLSearchParams(urlParams)

  const obj = {}
  for (const key of params.keys()) {
      if (params.getAll(key).length > 1) {
          obj[key] = params.getAll(key);
      } else {
          obj[key] = params.get(key);
      }
  }

  //style
  
  const styleHTML = `
  <style>
  #wrapper{
    width:50px;
    height: 50px;
    position: fixed;
    background-color: black;
    bottom: 0;
    right:0;
  }
  
  
  </style>
  `





  //event






  //inject html
  const target = document.body
  const html = `
  <div id="wrapper">Injected</div>
  
  `
  target.insertAdjacentHTML('afterbegin', html)
  target.insertAdjacentHTML('afterbegin', styleHTML)
  console.log('testing out jsDelivr')

}

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  callback();
} else {
  document.addEventListener("DOMContentLoaded", callback)
}