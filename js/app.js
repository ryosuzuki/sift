var natural = require('natural');
var stopwords = require('./stopwords.json');

function css(a) {
  var sheets = document.styleSheets, o = {};
  for (var i in sheets) {
    var rules = sheets[i].rules || sheets[i].cssRules;
    for (var r in rules) {
      if (a.is(rules[r].selectorText)) {
        o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
      }
    }
  }
  return o;
}



var elements = [];

$(document).on('click', 'a', function (event) {
  event.preventDefault();
})


$(document).on('click', 'a.hoge', function (event) {
  event.preventDefault();

  $(this).addClass('fuga');
  elements.push($(this));
  estimate(this);
})

$(document).on('click', '.hoge', function (event) {
  event.preventDefault();

  $(this).addClass('fuga');
  elements.push($(this));
  estimate(this);
});


$(document).on('click', '#barGraph', function (event) {
  event.preventDefault();
  barGraph();
})

$(document).on('click', '#tagCloud', function (event) {
  event.preventDefault();
  tagCloud();
})


var similar;
function estimate(element) {

  if (!similar) {
    var currentTag = $(element).prop('tagName').toLowerCase();
    var currentClass = $(element).prop('class').replace('hoge', '').replace('fuga', '').split(' ').filter(function (n) { return n != '' });
    var current;
    if (currentClass.length !== 0) {
      current = currentTag + '.' + currentClass.join('.');
    } else {
      current = currentTag;
    }
    console.log(current)

    var parentTag = $(element).parent().prop('tagName').toLowerCase()
    var parentClass = $(element).parent().prop('class').split(' ').filter(function (n) { return n != '' });;
    var parent;
    if (parentClass.length !== 0) {
      parent = parentTag + '.' + parentClass.join('.')
    } else {
      parent = parentTag;
    }
    console.log(parent)

    var target = parent + ' > ' + current;
    var children;
    if ($(element).children().length !== 0) {
      var childrenTag = $(element).children().prop('tagName').toLowerCase()
      var childrenClass = $(element).children().prop('class').split(' ').filter(function (n) { return n != '' });;
      if (childrenClass.length !== 0) {
        children = childrenTag + '.' + childrenClass.join('.');
      } else {
        children = childrenTag;
      }
      console.log(children);
    }

    if (children) {
      similar = $(target).has(children)
    } else {
      similar = $(target)
    }
  }

  if (elements.length > 1) {

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
    console.log(commons);

    if (Object.keys(commons).length > 1) {
      var candidates = $(similar).filter( function () {
        var same = true;
        var attrs = Object.keys(commons);
        for (var i=0; i<attrs.length; i++) {
          var attr = attrs[i];
          if ($(this).css(attr) !== commons[attr]) {
            same = false;
            break;
          }
        }
        return same;
      })
      $(candidates).addClass('fuga');
      var text = $(this).text();

      if ($('.fuga').length > elements.length) {
        $('body').addClass('off');

        $('<button id="barGraph" style="position:fixed;top:50px;right:30px;z-index:1000">Bar Graph</button>').prependTo('body');

        $('<button id="tagCloud" style="position:fixed;top:10px;right:30px;z-index:1000">Tag Cloud</button>').prependTo('body');
      }


    }
  }
}

function barGraph() {
  $('div#svg').remove();

  var text = '';
  $('.fuga').each(function(index) {
    text = text + ' ' + $(this).text();
  });
  var keywords = extract(text);
  console.log(keywords);

  var data = keywords.slice(0, 20);

  $('body').addClass('off').prepend("<div id='svg' style='background:#fff'></div>");

  var margin = {top: 40, right: 20, bottom: 30, left: 40};
  var width = 1000;
  var height = 400;
  var barWidth = height / data.length;
  var barMargin = barWidth / 3;

  var green = ['#edf8e9','#bae4b3','#74c476','#31a354','#006d2c'];
  var blue  = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
  var orange = ['#ffffd4','#fed98e','#fe9929','#d95f0e','#f25123'];
  var gray = ['#f7f7f7','#d9d9d9','#bdbdbd','#969696','#636363'];
  var white = ['#636363', '#969696', '#bdbdbd', '#d9d9d9', '#f7f7f7']
  var orangePurple = ['#5e3c99','#b2abd2','#f7f7f7','#fdb863','#e66101'];
  var yellowGreen = ['#018571','#80cdc1','#f5f5f5','#dfc27d','#a6611a'];
  var redBlue = ['#2c7bb6', '#abd9e9', '#ffffbf', '#fdae61', '#d7191c'];

  var color = green;

  var colorScale = d3.scale.linear()
  .range(color)
  .domain([
    0,
    d3.max(data, function (d) { return d.value; })*0.1,
    d3.max(data, function (d) { return d.value; })*0.3,
    d3.max(data, function (d) { return d.value; })*0.5,
    d3.max(data, function (d) { return d.value; })*0.7
  ]);

  var x = d3.scale.linear()
  .range([0, width])
  .domain([d3.min(keywords, function (d) {return d.value}), d3.max(data, function (d) { return d.value; })]);

  var y = d3.scale.linear()
  .range([height, 0])
  .domain([0, data.length]);

  var svg = d3.select('#svg')
  .append('svg')
  .attr('width', width)
  .style('background', '#fff')
  .attr('height', height)
  .append('g')

  var bar = svg.selectAll('g')
  .data(data)
  .enter()
  .append('g')

  bar.append('rect')
  .attr('transform', function (d, i) { return 'translate(0,' + i * barWidth + ')'; })
  .attr('x', 200)
  .attr('width', function (d) { return x(d.value); })
  .attr('height', barWidth - barMargin)
  .attr('fill', function (d) { return colorScale(d.value); })

  bar.selectAll('text')
  .data(data)
  .enter()
  .append('text')
  .attr('x', 200)
  .attr('y', function (d, i) { return height - y(i) - barMargin })
  .attr('dx', -5)
  .text(function(d){ return d.text; })
  .attr('text-anchor', 'end')
}


function tagCloud() {
  $('div#svg').remove();

  var text = '';
  $('.fuga').each(function(index) {
    text = text + ' ' + $(this).text();
  });
  //console.log(text);

  var keywords = extract(text);
  console.log(keywords);
  $('body').addClass('off').prepend("<div id='svg' style='background:#fff'></div>");

  d3.layout.cloud().size([1000, 300])
  .words(keywords)
  .padding(5)
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .fontSize(function(d) { return d.size; })
  .on('end', draw)
  .start();
}

function extract(text) {
  var results = [];
  var keywords = {};
  var combined, combinedResults = {};

  var stem = function(word) {
    var stem = natural.PorterStemmer.stem(word);
    return stem;
  };

  var TfIdf = natural.TfIdf;
  TfIdf.prototype.listMostFrequestTerms = function(d) {
    var terms = [];
    for(var term in this.documents[d]) {
      terms.push({term: term, tf: natural.TfIdf.tf(term, this.documents[d])});
    }
    return terms.sort(function(x, y) { return y.tf - x.tf; });
  };

  var lowerNgram = 2;
  var upperNgram = 3;
  for(i=lowerNgram; i <= upperNgram; i++) {
    var keywordsForNgram;
    var tfidf = new TfIdf();
    var tokenized = natural.NGrams.ngrams(text, i).map( function(ngram) {
      return ngram.join(' ').toLowerCase();
    });
    tfidf.addDocument(tokenized);
    keywordsForNgram = tfidf.listMostFrequestTerms(0);
    /*
     * keywordsForNgram = [ {term: 'hoge', tf: 7 }, ... ]
     */

    // remove common words
    keywordsForNgram = keywordsForNgram.map( function(item) {
      var words = item.term.split(' ');
      for(var i=0; i < words.length; i++) {
        if (stopwords.indexOf(words[i]) !== -1) {
          return false;
        }
      }
      return {
        term: item.term,
        tf: item.tf * Math.pow(i, 0.5) //* Math.pow(item.term.split(' ').length, 2) * 10
      }
    });

    results = results.concat(keywordsForNgram);
  }

  results.sort( function(a, b) { return b.tf - a.tf } );
  console.log(results);

  var limit = 30;
  var min = 1;
  results = results.slice(0, limit)
  .filter( function(item) {
    return item.tf >= min;
  })
  .map( function(item) {
    return {
      'text': item.term,
      'size': item.tf * 10,
      'tf': item.tf,
      'value': item.tf,
      //'x': Math.random() * 1000,
      //'y': Math.random() * 300
    }
  });

  return results; // ['hoge', 'fuga', 'foo']
}


$(function() {

  $('head').append('<style>.hoge{background-color: orange !important;} .fuga{background: red !important;}</style><script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>');

  $('body').on('mouseenter', '*', function(e) {
    addHoverHighlight($(this), e);
  });

  var addHoverHighlight = function(element, event){
    $('.hoge').each(function() {
      unhover($(this));
    });

    if(!$('body').hasClass('off')) {
      element.addClass('hoge');
    }

    element.on('mouseleave', function() {
      unhover($(this));
    });
  };

  var unhover = function(element) {
    element.removeClass('hoge');
  };

});


jQuery.fn.cssAll = (function(css2) {
  return function() {
    if (arguments.length) { return css2.apply(this, arguments); }
    var attr = ['font-family','font-size','font-weight','font-style','color',
    'text-transform','text-decoration','letter-spacing','word-spacing',
    'line-height','text-align',/*'vertical-align','direction','background-color',
    'background-image','background-repeat','background-position',
    'background-attachment',*/'opacity','width','height','top','right','bottom',
    'left','margin-top','margin-right','margin-bottom','margin-left',
    'padding-top','padding-right','padding-bottom','padding-left',
    /*'border-top-width','border-right-width','border-bottom-width',
    'border-left-width','border-top-color','border-right-color',
    'border-bottom-color','border-left-color','border-top-style',
    'border-right-style','border-bottom-style','border-left-style',*/'position',
    'display','visibility','z-index','overflow-x','overflow-y','white-space',
    'clip','float','clear','cursor'/*,'list-style-image','list-style-position',
    'list-style-type','marker-offset'*/];
    var len = attr.length, obj = {};
    for (var i = 0; i < len; i++) {
      obj[attr[i]] = css2.call(this, attr[i]);
    }
    return obj;
  };
})(jQuery.fn.css);



function draw(keywords) {
  var fill = d3.scale.category20();
  d3.select('#svg')
  .append('svg')
  .attr({
    'width': 1000,
    'height': 300
  })
  .append('g')
  .attr('transform', 'translate(500,150)')
  .selectAll('text')
  .data(keywords)
  .enter().append("text")
  .style({
    'font-size': function(d) { return d.size + 'px'; },
    'font-family': 'Ubuntu',
    'fill': function(d, i) { return fill(i); }
  })
  .attr({
      //'x': function(d) { return d.x },
      //'y': function(d) { return d.y },
      'text-anchor': 'middle',
      'transform': function(d) {
  // return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
  return 'translate(' + [d.x, d.y] + ')';
}
})
  .text(function(d) { return d.text; });
}


function createKeywords (text) {
  if (!text) {
    text = "A quick brown fox jumps over the lazy old bartender who said 'Hi!' as a response to the visitor who presumably assaulted the maid's brother, because he didn't pay his debts in time. In time in time does really mean in time. Too late is too early? Nonsense! 'Too late is too early' does not make any sense.";
  }

  var atLeast = 2;       // Show results with at least .. occurrences
  var numWords = 5;      // Show statistics for one to .. words
  var ignoreCase = true; // Case-sensitivity
  var REallowedChars = /[^a-zA-Z'\-]+/g;
   // RE pattern to select valid characters. Invalid characters are replaced with a whitespace

   var i, j, k, textlen, len, s;
  // Prepare key hash
  var keys = [null]; //"keys[0] = null", a word boundary with length zero is empty
  var results = [];
  numWords++; //for human logic, we start counting at 1 instead of 0
  for (i=1; i<=numWords; i++) {
    keys.push({});
  }

  // Remove all irrelevant characters
  text = text.replace(REallowedChars, " ").replace(/^\s+/,"").replace(/\s+$/,"");

  // Create a hash
  if (ignoreCase) text = text.toLowerCase();
  text = text.split(/\s+/);
  for (i=0, textlen=text.length; i<textlen; i++) {
    s = text[i];
    if (stopwords.indexOf(s) !== -1) {
      continue;
    }
    keys[1][s] = (keys[1][s] || 0) + 1;
    for (j=2; j<=numWords; j++) {
      if(i+j <= textlen) {
        s += " " + text[i+j-1];
        keys[j][s] = (keys[j][s] || 0) + 1;
      } else break;
    }
  }

  // Prepares results for advanced analysis
  for (var k=1; k<=numWords; k++) {
    results[k] = [];
    var key = keys[k];
    for (var i in key) {
      if(key[i] >= atLeast) results[k].push({"word":i, "count":key[i]});
    }
  }

  var hash = {};
  for (var k=1; k<=numWords; k++) {
    console.log(keys[k]);
    $.extend(hash, keys[k])
  }

  return hash;
}


