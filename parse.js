var html = "<tr align=\"left\" valign=\"top\" class=\"\">    <td><div align=\"justify\"></div></td>    <td class=\"pub\"> <div align=\"justify\" class=\"\"><br>      Nikola Banovi, Koji Yatani, and Khai N. Truong.        <span class=\"pub_bold\">\"Escape-Keyboard: A Sight-free One-handed Text Entry Method for Mobile Touch-screen Devices\"</span>        <span class=\"pub_italic\">International Journal of Mobile Human Computer Interaction</span>, Vol. 5, No. 3, pp. 42 -- 61,  2013.            </div></td>    <td valign=\"bottom\" class=\"\"><div align=\"justify\" class=\"fuga\">    <a href=\"paper/IJMHCI2013.pdf\" target=\"_blank\" class=\"\">[PDF]</a>    <br><a href=\"publication.php?mode=b&amp;id=54\" target=\"_blank\">[bibtex]</a>      </div>    </td>  </tr>"

var htmlparser = require("htmlparser2");
var parser = new htmlparser.Parser({
    // onopentag: function(name, attribs){
        // if(name === "script" && attribs.type === "text/javascript"){
        //     console.log("JS! Hooray!");
        // }
    // },
    ontext: function(text){
        console.log("<span>", text, "</span>");
    },
    // onclosetag: function(tagname){
        // if(tagname === "script"){
        //     console.log("That's it?!");
        // }
    // }
}, {decodeEntities: true});
parser.write(html);
parser.end();


