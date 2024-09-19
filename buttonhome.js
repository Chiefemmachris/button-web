const bar = document.getElementById("menu1");
const nav = document.getElementById("navbar");
const clo = document.getElementById("closer1");
if (bar) {
  bar.addEventListener('click', () =>{
    nav.classList.add('active')
  })
};

if (clo) {
  clo.addEventListener('click', () =>{
    nav.classList.remove('active')
})
};

//here is for opening an account
const wrapper1 = document.querySelector('.wrapper')
const login = document.querySelector('.signin')
const oaA = document.querySelector('.OaA')
const closerlogin = document.querySelector('.firsticon')

login.addEventListener('click',()=> {
  wrapper1.classList.add('active')
})

closerlogin.addEventListener('click',()=> {
  wrapper1.classList.remove('active')
})


//here is for openig an account in desktop
const wrapper1kt = document.querySelector('.wrapperkt')
const wrapper1k = document.querySelector('.wrapperk')
const logink = document.querySelector('.signink')
const oaAk = document.querySelector('.OaAk')
const closerlogink = document.querySelector('.firsticonk')
const rowbardk = document.getElementById('rowbar')

logink.addEventListener('click',()=> {
  wrapper1k.classList.add('active')
})

closerlogink.addEventListener('click',()=> {
  wrapper1k.classList.remove('active')
})


logink.addEventListener('click',()=> {
  wrapper1kt.classList.add('active')
})

closerlogink.addEventListener('click',()=> {
  wrapper1kt.classList.remove('active')
})

logink.addEventListener('click',()=> {
  rowbardk.classList.add('active')
})

closerlogink.addEventListener('click',()=> {
  rowbardk.classList.remove('active')
})

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      