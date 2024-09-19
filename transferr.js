const transfer = document.querySelector('.transferit');
const cartonItransfer = document.querySelector('.cartonItransfer');
const WrappercartonItransfer = document.querySelector('.wrappercartonItransfer');
const Closetransfericon = document.querySelector('.closetransfericon');
//for testing
/*const Transferitnow=document.querySelector('.transferitnow');
const Trxtocon = document.querySelector('.trxtoconn');
const Wrappertrxtocon = document.querySelector('.wrappertrxtocon');
const Finalcancel = document.querySelector('.finalcancel');*/

transfer.addEventListener('click', ()=>{
    WrappercartonItransfer.classList.add('active')
    
})

transfer.addEventListener('click', ()=>{
    cartonItransfer.classList.add('active')
    
})

Closetransfericon.addEventListener('click',()=>{
    cartonItransfer.classList.remove('active')
})

Closetransfericon.addEventListener('click', ()=>{
    WrappercartonItransfer.classList.remove('active');
    location.reload();
})



//should be in server
/*Transferitnow.addEventListener('click', ()=>{
    Trxtocon.classList.add('active')
})
Transferitnow.addEventListener('click',()=>{
    Wrappertrxtocon.classList.add('active')
})

Finalcancel.addEventListener('click', ()=>{
    WrappercartonItransfer.classList.remove('active');
    Wrappertrxtocon.classList.remove('active');
})*/