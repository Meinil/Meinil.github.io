---
title: Promise
date: '2021-05-03'
sidebar: 'auto'
categories:
 - javascript
tags:
 - javascript
 - 前端
---

## 1. 简介

### 1.1 Promise是什么

> **抽象表达**

1. `Promise`是一门新的技术

2. `Promise`是`JS`中进行异步编程的新解决方案

   异步操作：文件操作、数据库操作、AJAX、定时器

> **具体表达**

**场景分析**：点击按钮1s后显示是否中奖(中奖率为`30%`)

1. 回调函数实现

   ```html
   <button id="btn">点击抽奖</button>
   <script>
       // 生成随机数
       function rand(m, n) {
           return Math.ceil(Math.random() * (n - m + 1)) + m - 1
       }
       const btn = document.querySelector("#btn")
       btn.addEventListener("click", () => {
           setTimeout(() => {
               let n = rand(1, 100)
               if (n <= 30) {
                   alert("恭喜中奖")
               } else {
                   alert("再接再厉")
               }
           }, 1000)        
       })
   </script>
   ```

2. promise实现

   ```html
   <button id="btn">点击抽奖</button>
   <script>
       // 生成随机数
       function rand(m, n) {
           return Math.ceil(Math.random() * (n - m + 1)) + m - 1
       }
       btn.addEventListener("click", () => {
           // resolve 成功的回调
           // reject 失败的回调
           const p = new Promise((resolve, reject) => {
               setTimeout(() => {
                   let n = rand(1, 100)
                   if (n <= 30) {
                       resolve()
                   } else {
                       reject()
                   }
               }, 1000)   
           })
   
           p.then(
               () => {
                   alert("恭喜中奖")
               },
               () => {
                   alert("再接再厉")
               }
           )
       })
   </script>
   ```

**场景2**：`AJAX`请求

1. 回调形式

   ```html
   <button id="btn">点击发送</button>
   <script>
       const btn = document.querySelector("#btn")
       btn.addEventListener('click', () => {
           // 1.创建对象
           const xhr = new XMLHttpRequest()
   
           // 2.初始化
           xhr.open("GET", "https://api.apiopen.top/getJoke")
   
           // 3.发送
           xhr.send()
   
           // 4.处理响应结果
           xhr.onreadystatechange = () => {
               if (xhr.readyState === 4) {
                   if (xhr.status >= 200 && xhr.status < 300) {
                       console.log(xhr.response)
                   } else {
                       console.log(xhr.status)
                   }
               }
           }
       })
   </script>
   ```

2. `Promise`形式

   ```html
   <button id="btn">点击发送</button>
   <script>
       const btn = document.querySelector("#btn")
       btn.addEventListener('click', () => {
           const p = new Promise((resolve, reject) => {
               // 1.创建对象
               const xhr = new XMLHttpRequest()
   
               // 2.初始化
               xhr.open("GET", "https://api.apiopen.top/getJok")
   
               // 3.发送
               xhr.send()
   
               // 4.处理响应结果
               xhr.onreadystatechange = () => {
                   if (xhr.readyState === 4) {
                       if (xhr.status >= 200 && xhr.status < 300) {
                           resolve(xhr.response)
                       } else {
                           reject(xhr.status)
                       }
                   }
               }
           })
   
           p.then(
               res => {
                   console.log(res)
               },
               err => {
                   console.warn(err)
               }
           )
       })
   </script>
   ```

**场景3**：自定义封装读取文件

```javascript
// 封装Promise读取文件内容
const mineReadFile = (path) => {
    return new Promise((resolve, reject) => {
        require('fs').readFile(path, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data)
        })
    })
}


mineReadFile("./01-初体验.html")
.then(
    data => {
        console.log(data.toString())
    },
    err => {
        console.log(err)
    }
)
```

### 1.2 为什么使用Promise

> **指定回调函数的方式更加灵活**

1. 旧的(回调)：必须在启动异步任务之前指定
2. `Promise`：启动异步任务=>返回`Promise`对象=>给`Promise`对象绑定回调函数(甚至可以在异步任务结束后指定/多个)

> **解决回调地狱问题**

链式调用，用与解决回调地狱问题

### 1.3 状态

是`Promise`中的一个属性的值`PromiseState`

主要有三种状态

1. `pending`：未决定的
2. `resolved/fullfilled` ：成功
3. `rejected`：失败

### 1.4 值

`Promise`对象中的另一个属性`PromiseResult`，保存着异步任务成功/失败的结果

只能通过`resolve`和`reject`进行更改

## 2. API

> **构造函数**Promise(excutor){}

1. `executor`函数：执行器

   ```javascript
   (resolve, reject) => {}
   ```

2. `resolve`函数：内部定义成功时我们调用的函数

   ```javascript
   value => {}
   ```

3. `reject`函数：内部定义失败时我们调用的函数

   ```javascript
   reason => {}
   ```

`executor`会在`Promise`内部立即同步调用，异步操作在执行器中执行

> **Promise.prototype.then方法：(onResolved, onRejected) => {}**

1. `onResolved`函数：成功的回调函数

   ```javascript
   value => {}
   ```

2. `onRejected`函数：失败的回调函数

   ```javascript
   reason => {}
   ```

用于指定得到成功`value`的成功回调和用于得到失败`reason`的失败回调，返回一个新的`Promise`对象

> **Promise.prototype.catch：(onRejected) => {}**

只用于指定失败的回调函数

> **Promise.resolve：(value) => {}**

`value`：成功的数据或`Promise`对象，返回一个成功/失败的`Promsie`对象

1. 如果`value`为非`Promise`类型的对象，则返回的结果为成功的`Promise`对象

   ```javascript
   let p = Promise.resolve(123)
   p.then(value => {
       console.log(value) // 123
   })
   ```

2. 如果`value`为`Promise`类型的对象，则参数的结果决定着`resolve`的结果

   ```javascript
   let p = Promise.resolve(new Promise((resolve, reject) => {
       resolve("ok") 
   }))
   p.then(value => {
       console.log(value) // ok
   })
   ```

> **Promise.reject：(reason) => {}**

`reason`失败的原因，返回一个失败的`Promise`对象

```javascript
let p = Promise.reject("error")
p.then(value => {
    console.log(value)
}).catch(reason => {
    console.log(reason) // error
})
```

> **Promise.all：（promises) => {}**

`promises`：包含n个`promise`的数组，返回一个新的`promise`，只有所有的`promise`都成功时才成功，只要有一个失败就失败

成功的情况

```javascript
let p = Promise.all([
    new Promise((resolve, reject) => {
        resolve("success")
    }),
    new Promise((resolve, reject) => {
        resolve("success")
    }),
    new Promise((resolve, reject) => {
        resolve("success")
    }),
])
p.then(value => {
    console.log(value) // ["success", "success", "success"]
}).catch(reason => {
    console.log(reason)
})
```

失败的情况

```javascript
let p = Promise.all([
    new Promise((resolve, reject) => {
        resolve("success")
    }),
    new Promise((resolve, reject) => {
        resolve("success")
    }),
    new Promise((resolve, reject) => {
        reject("error")
    }),
])
p.then(value => {
    console.log(value)
}).catch(reason => {
    console.log(reason) // error
})
```

> **Promise.race：(promises) => {}**

`promises`：包含n个`promise`的数组，返回一个新的`promise`，第一个完成的`promise`的结果状态就是最终的结果状态

```javascript
let p = Promise.race([
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("success1")
        }, 1000)
    }),
    new Promise((resolve, reject) => {
        resolve("success2")
    }),
    new Promise((resolve, reject) => {
        reject("error")
    }),
])
p.then(value => {
    console.log(value) // success2
}).catch(reason => {
    console.log(reason)
})
```

## 3. 关键问题

> **修改对象的状态**

1. `resolve`函数

   ```javascript
   let p = new Promise((resolve, reject) => {
       resolve("ok")
   })
   p.then(value => {
       console.log(value) // ok
   }).catch(reason => {
       console.log(reason)
   })
   ```

2. `reject`函数

   ```javascript
   let p = new Promise((resolve, reject) => {
       reject("error")
   })
   p.then(value => {
       console.log(value)
   }).catch(reason => {
       console.log(reason)
   })
   ```

3. 抛出错误

   ```javascript
   let p = new Promise((resolve, reject) => {
       throw "throw error"
       console.log("============")
   })
   p.then(value => {
       console.log(value) // throw error
   }).catch(reason => {
       console.log(reason)
   })
   ```

   一旦抛出错误，抛出错误下方的代码均不执行

> **指定多个回调**

```javascript
let p = new Promise((resolve, reject) => {
    resolve("OK")
})
p.then(value => {
    console.log(value + "-1") // OK-1
})

p.then(value => {
    console.log(value + "-2") // OK-2
})
```

当状态发生该表时，回调函数都会执行

> **改变状态与指定回调函数先后**

1. 当改变状态是一个同步操作时，先改变状态再指定回调

   ```javascript
   let p = new Promise((resolve, reject) => {
       resolve("OK")
   })
   
   p.then(value => {
       console.log(value) // OK
   })
   ```

2. 当改变状态是一个异步操作时，先指定回调再改变状态

   ```javascript
   let p = new Promise((resolve, reject) => {
       setTimeout(() => {
           resolve("OK")
       }, 1000)
   })
   
   p.then(value => {
       console.log(value) // OK
   })
   ```

> **then方法的返回结果**

```javascript
let p = new Promise((resolve, reject) => {
    resolve("OK")
})

let result = p.then(value => {
    console.log(value)
})

console.log(result) // Promise {<pending>}
```

1. `then()`的返回结果，由指定的回调函数执行的结果决定

2. 分为三种情况

   如果抛出异常，新`promise`变为`rejected`，`reason`为抛出的异常(状态为失败)

   如果返回的是非`promise`的任意值，新`promise`变为`resolved`，`value`为返回的值(状态为成功)

   若果返回的是一个新的`promise`，此`promise`的结果就会成为新的`promise`的结果

   ```javascript
   let result = p.then(value => {
       return new Promise((resolve, reject) => {
           resolve("success")
       })
   })
   ```

> **串联多个操作**

`promise`的`then()`返回一个新的`promise`，可以开成`then()`的链式调用

```javascript
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("ok-1")
    }, 1000)
})

p.then(value => {
    console.log(value)
    return new Promise((resolve, reject) => {
        resolve("ok-2")
    })
}).then(value => {
    console.log(value)
})
// ok-1
// ok-2
```

> **异常穿透**

1. 当使用的`promise`的`then`链式调用时，可以在最后指定失败的回调
2. 前面的任何操作出了异常，都会传到最后失败的回调中处理

```javascript
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("OK")
    }, 1000)
})

p.then(value => {
    console.log("OK")
    return new Promise((resolve, reject) => {
        reject("error")
    })
}).then(value => {
    console.log(value)
}).catch(reason => {
    console.log(reason)
})
```

> **中断Promise链**

当切仅当返回一个`pending`状态的`Promise`时才会中断

```javascript
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("OK")
    }, 1000)
})

p.then(value => {
    console.log(1)
}).then(value => {
    console.log(2)
}).then(value => {
    console.log(3)
    return new Promise(() => {})
}).then(value => {
    console.log(4)
})
// 1
// 2
// 3
```

## 4. 自定义封装

### 4.1 初始结构

1. `index.html`

   ```html
   <script src="./promise.js"></script>
   <script>
       let p = new Promise((resolve, reject) => {
           resolve("OK")
       })
       p.then(value => {
           console.log(value)
       })
   </script>
   ```

2. `promise.js`

   ```javascript
   function Promise (executor) {
   }
   
   Promise.prototype.then = function(onResolved, onReject) {
   }
   ```

### 4.2 resolve与reject功能实现

```javascript
function Promise (executor) {
    // 添加属性和状态
    this.promiseState = "pending"
    this.promiseResult = null
    this.callabcks = [] // 保存回调

    // resolve函数
    const resolve = (data) => {
        // 修改对象的状态(promiseState)
        this.promiseState = "fulfilled"
        // 设置对象结果值(promiseResult)
        this.promiseResult = data
    }

    // reject函数
    const reject = (error) => {
        // 修改对象的状态(promiseState)
        this.promiseState = "rejected"
        // 设置对象结果值(promiseResult)
        this.promiseResult = error
    }
    // 同步调用 执行器函数
    executor(resolve, reject)
}
```

### 4.3 添加throw处理

只需要使用`try...catch`包裹执行器函数即可，在出错的情况下把状态设置为`rejected`

```javascript
try{
    // 同步调用 执行器函数
    executor(resolve, reject)
} catch(error) {
    reject(error)
}
```

### 4.4 状态修改

`Promise`的状态只能修改一次，且只能从`pending`->`fulfilled | rejected`，需要在改变状态前，检查状态是否已被修改

```javascript
const resolve = (data) => {
    if (this.promiseState !== "pending") return
    // 修改对象的状态(promiseState)
    this.promiseState = "fulfilled"
    // 设置对象结果值(promiseResult)
    this.promiseResult = data
}
```

`reject`同理

### 4.5 then方法回调

```javascript
Promise.prototype.then = function(onResolved, onReject) {
    if (this.promiseState === "fulfilled") {
        onResolved(this.promiseResult)
    } else {
        onReject(this.promiseResult)
    }
}
```

对于异步任务的处理，需要首先在then中保存回调，在`Promise`中调用，因为对于`then`函数可能会有多次调用，所以选择使用数组进行保存回调

```javascript
Promise.prototype.then = function(onResolved, onReject) {
    if (this.promiseState === "fulfilled") {
        onResolved(this.promiseResult)
    } else if (this.promiseState === "rejected"){
        onReject(this.promiseResult)
    } else { // 异步任务处理
        // 保存回调函数
        this.callabcks.push({
            onResolved: onResolved,
            onReject: onReject
        })
    }
}
```

在`promise`的`resolve`和`reject`中判断对应的`callback`是否存在，存在则调用

```javascript
// resolve
this.callabcks.forEach((callabck) => {
    if (callabck.onResolved){
        callabck.onResolved(data)
    }
})

// reject
this.callabcks.forEach((callabck) => {
    if (callabck.onReject){
        callabck.onReject(error)
    }
})
```

### 4.6 处理then方法返回值的问题

1. `then`方法如果返回普通对象(非`Promise`)，直接成功即可
2. 如果返回`Promise`对象，则应该返回这个`Promise`对象执行的结果

```javascript
Promise.prototype.then = function(onResolved, onReject) {
    return new Promise((resolve, reject)=> {
        if (this.promiseState === "fulfilled") {
            let result = onResolved(this.promiseResult)
            if (result instanceof Promise) { // 是promise类型，执行promise操作
                result.then(value => {
                    resolve(value)
                }, reason => {
                    reject(reason)
                })
            } else { // 否则直接resolve
                resolve(result)
            }
        } else if (this.promiseState === "rejected"){
            onReject(this.promiseResult)
        } else { // 异步任务处理
            // 保存回调函数
            this.callabcks.push({
                onResolved: onResolved,
                onReject: onReject
            })
        }
    })
}
```

### 4.7 异步处理即代码优化

```javascript
Promise.prototype.then = function(onResolved, onReject) {
    return new Promise((resolve, reject)=> {
        // 封装回调函数
        const callback = (type) => {
            try{
                // 执行成功的回调
                let result = type(this.promiseResult)
                if (result instanceof Promise) { // 是promise类型，执行promise操作
                    result.then(value => {
                        resolve(value)
                    }, reason => {
                        reject(reason)
                    })
                } else { // 否则直接resolve
                    resolve(result)
                }
            } catch(err) {
                reject(err)
            }
        }
        if (this.promiseState === "fulfilled") {
            callback(onResolved)
        } else if (this.promiseState === "rejected"){
            callback(onReject)
        } else { // 异步任务处理
            // 保存回调函数
            this.callabcks.push({
                onResolved: () => {
                    callback(onResolved)
                },
                onReject: () => {
                    callback(onReject)
                }
            })
        }
    })
}
```

## 5. async与await

### 5.1 async函数

1. 函数的返回值为`promise`对象
2. `promise`对象的结果由`async`函数执行的返回值决定

```javascript
async function main() {
    // 1.返回非promise类型的数据，状态为成功
    // return 123 

    // 2.返回promise对象，由promise的结果决定
    // return new Promise((resolve, reject) => {
    //     reject("失败")
    // })

    // 3.抛出异常，状态为失败
    throw "出错"
}
let result = main()
console.log(result)
```

### 5.2 await表达式

1. `await`右侧的表达式一般为`promise`对象，但也可以是其它的值

2. 如果表达式是`promise`对象，`await`返回的是`promise`成功的值

   ```javascript
   const main = async () => {
       let p = await new Promise((resolve, reject) => {
           resolve("OK")
       })
       console.log(p)
   }
   main() // OK
   ```

3. 如果表达式是其他值，直接将此值作为`await`的返回值

   ```javascript
   const main = async () => {
       let p = await 20
       console.log(p)
   }
   main() // 20
   ```

   

> **注意**

1. `await`必须写在`async`函数中，但`async`函数中可以没有`await`

2. 如果`await`的`promise`失败了，就会抛出异常，需要通过`try...catch`捕获处理

   ```javascript
   const main = async () => {
       try {    
           let p = await new Promise((resolve, reject) => {
               reject("error")
           })
           console.log(p)
       } catch(err) {
           console.log(err) // error
       }
   }   
   main() 
   ```

### 5.3 async与await的案例

> **案例分析：**使用async与await读取文件

```javascript
const fs = require("fs")
const utils = require("util")
const mineReadFile = utils.promisify(fs.readFile)


const main = async() => {
    // 读取第一个文件的内容
    try {
        let data1 = await mineReadFile("./01-async.html")
        let data2 = await mineReadFile("./02-await.html")
        console.log(data1.toString(), data2.toString())
    } catch(err) {
        console.log(err)
    }
}

main()
```

