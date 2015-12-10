# Sift: Date Extraction and Visualization Tool on the Web

This is my final project for CSCI-5535 (Fundamental Concepts of Programming Languages by Prof. Matthew Hammer)

# Why Sift 

One of the biggest problems of data visualization is you have to prepare the data by yourself. 
However, this data collection/cleaning can be tedious and repetitive tasks. Moreover, especially end-users, who don't have technical knowledge or skills, may not be able to collect data through API.

So, we propose Sift, a data extraction and visualization tool for end-users. Here is a screenshot.
![](https://github.com/ryosuzuki/sift/blob/master/resources/demo.gif)


# How to use it

Go to Chrome Web Store and install it. -> [[Sift on Chrome Web Store](https://chrome.google.com/webstore/detail/sift-date-extraction-and/jbcecgeacaplcfhomelekapejnbjifpc/)]

Click the icon to start. That's it.


# How it works 

We leverage the idea of "Programming by Example" to predict what you want to extract through a bunch of examples. 
More specifically, the program recognize basically three fetures from the selection, 1) parent node, 2) children node, 3) css style of the current node. When you give more than two examples, the system recognizes common features of these two, and synthesize program based on it. Something like that. 

```js
var commons = {}
for (var i=0; i<elements.length-1; i++) {
  var a = $(elements[i]).cssAll();
  var b = $(elements[i+1]).cssAll();
  Object.keys(a).forEach( function (attr) {
    if (a[attr] == b[attr]) {
      commons[attr] = a[attr];
    } else {
      delete commons[attr]
    }
  });
}
```

The code is MIT license, and you can feel free to change it and send a pull request. (But note that the code is REALLY MESSY since it's a proof-of-concept prototype.)
The slide of the final presentation is also available [here](https://github.com/ryosuzuki/sift/blob/master/resources/slide.pdf). 

Enjoy! - Ryo
