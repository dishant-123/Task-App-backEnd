// const doWorkPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject('Things went wrong!')
//         resolve([7, 4, 1])
//     }, 2000)
// })

// doWorkPromise.then((result) => {
//     console.log('Success!', result)
// }).catch((error) => {
//     console.log('Error!', error)
// })

//
//                               fulfilled
//                              /
// Promise      -- pending --> 
//                              \
//                               rejected
//
const promise = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        // resolve('The task Completed')
        reject('Oops! Error Occur')
    },2000)
})
promise.then((result) =>{
    console.log(result)
}).catch(function(error){
    console.log(error);
})