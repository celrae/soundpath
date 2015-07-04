var myList = {};
var mode = "search";

var QueryString = function () {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
    	// If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], pair[1]];
            query_string[pair[0]] = arr;
    	// If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
}();

function search() {
    mode = "search";
    
    getJSON('/find', { keywords: $("#keywords").val() }, function (data) {
        results = data;
        
        update();
    });
}

function getId(id) {
    mode = "list";
    
    $("#resultCount").html('');
    getJSON('/get', { id: id }, function (data) {
        results = data;
        
        update();
    });
}

function viewList() {
    mode = "list";
    
    results = [];
    for (var prop in myList) {
        results.push(myList[prop]);
    }
    
    update();
}

function update() {
    var data = results;
    var errors = 0;
    
    d3.select("#results").selectAll('div').remove();
    d3.select("#results").append('div').html('<img src="/images/loading.gif" alt="loading" />');
    
    if (mode == "search") {
        var share = '<a target="_blank" href="http://';
        
        share += (window.location.host + '?keywords=' + escape($("#keywords").val()));
        share += '"><i style="font-size: 12px" class="glyphicon glyphicon-share"></i> share</a>';
        
        $("#filter").html(share);
    }
    
    d3.select("#results").selectAll('img').remove();
    if (!data || data.length == 0) {
        $("#resultCount").html('0 results');
        return;
    }
    
    
    $("#resultCount").html(data.length + ' results' + (errors > 0 ? ', errors: ' + errors : ''));
    
    var div = d3.select("#results").selectAll('div')
	.data(data)
	.enter().append('div')
	.attr('class', 'course');
    
    div.append('div').append('h3').html(function (d) {
        
        return (d.document ? d.document.title : '');
    });

    div.append('div').html(function (d) {
        var data = (d.document.contentencoded ? d.document.contentencoded : d.document.title);
        
        var link = '<a href="#" onclick="javascript: saveClass(\'' + d.id.trim() + '\',this);"><i class="glyphicon glyphicon-plus"></i> add to cart</a>';
        if (myList && myList[d.id]) {
            link = '<a href="#" onclick="javascript: removeClass(\'' + d.id.trim() + '\',this);"><i class="glyphicon glyphicon-minus"></i> remove from cart</a>';
        }
        
        var share = '<a target="_blank" href="http://' + window.location.host + '?id=' + d.id + '"><i class="glyphicon glyphicon-share"></i> share</a>';
        
        var resp = '<b>Audio</b></br><table cellspacing="5"><th><tr><td>duration (secs) </td><td>link</td></tr></th><tbody>';
        
        d.document.audio.forEach(function (subitem) {
            if (subitem.href) {
                resp += '<tr><td>' + ((subitem.meta && subitem.meta.duration) ? subitem.meta.duration : '') 
                        + "</td><td><a href='" + subitem.href + "'>Play</a></td></tr>";
            }
        });
        
        resp += "</tbody></table>";
        
        return (data + '<hr>' + resp + '<br />' + link + '<br />' + share + '<br />');

    });

    
    //div.html(function (d) {
    //    if (!d.document) {
    //        return;
    //    }
        
    //    //var content = '<div class="pull-left"><h3>' + (d.document ? d.document.title : '') + '</h3></div>'

    //    var left = '<h3>' + (d.document ? d.document.title : '') 
    //                    + '</h3></br>' + +moment(d.document.published).format("YYYY-MM-DD HH:mm:ssZ") + '</br>' 
    //                    + d.document.contentencoded ? d.document.contentencoded : d.document.title;
    
    //    var resp = '<b>Audio Links</b></br><table cellspacing="5"><th><tr><td>duration (secs) </td><td>link</td></tr></th><tbody>';

    //    d.document.audio.forEach(function (subitem) {
    //        if (subitem.href) {
    //            resp += '<tr><td>' + ((subitem.meta && subitem.meta.duration) ? subitem.meta.duration : '')
    //                    + "</td><td><a href='" + subitem.href + "'>Play</a></td></tr>";
    //        }
    //    });
        
    //    resp += "</tbody></table>";

    //    var link = '<a href="#" onclick="javascript: saveClass(\'' + d.id.trim() + '\',this);"><i class="glyphicon glyphicon-plus"></i> add to cart</a>';
    //    if (myList && myList[d.id]) {
    //        link = '<a href="#" onclick="javascript: removeClass(\'' + d.id.trim() + '\',this);"><i class="glyphicon glyphicon-minus"></i> remove from cart</a>';
    //    }
        
    //    var share = '<a target="_blank" href="http://' + window.location.host + '?id=' + d.id + '"><i class="glyphicon glyphicon-share"></i> share</a>';
        
    //    resp += '<br />' + link + '<br />' + share + '<br />';
        
    //    return left + resp;
        
    //    //return content;
    //});
    
    
    
    highlight();
}

function saveClass(id, elem) {
    if (myList[id] != null) {
        alert("Item is already in your list");
    }
    
    $.each(results, function (i, d) {
        if (d.id == id) {
            myList[id] = d;
            $(elem)[0].outerHTML = '<a href="#" onclick="javascript: removeClass(\'' + id.trim() + '\',this);"><i class="glyphicon glyphicon-minus"></i> remove from cart</a>';
        }
    });
    
    saveList();
}

function removeClass(id, elem) {
    
    if (!myList[id]) {
        return;
    }
    
    delete myList[id];
    
    saveList();
    
    if (window.location.pathname.indexOf('list') > -1) {
        window.location.reload();
    } else {
        $(elem)[0].outerHTML = '<a href="#" onclick="javascript: saveClass(' + id + ');"><i class="glyphicon glyphicon-plus"></i> add to cart</a>';
    }
}

function loadList() {
    if (typeof (Storage) !== "undefined") {
        try {
            myList = JSON.parse(localStorage.getItem("ClassList") || {});
        } catch (e) {
            myList = {};
        }
    }
}

function saveList() {
    if (typeof (Storage) !== "undefined") {
        try {
            localStorage.setItem("ClassList", JSON.stringify(myList));
        } catch (e) { }
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function highlight() {
    return;  //temp disable
    
    if ($("#highlightChk").prop('checked')) {
        var strict = $("#strictChk").prop('checked');
        myHilitor = new Hilitor("results");
        myHilitor.setMatchType('open');
        var keywords = (strict ? ' ' + $("#keywords").val() + ' ' : $("#keywords").val());
        myHilitor.apply(keywords);
    } else {
        myHilitor.remove();
    }
}

function addError(error) {
    var self = this;
    
    $("#status").html(error);
}

function getJSON(url, data, onSuccess, onError, onComplete) {
    
    $.ajax({
        type : "GET",
        url : url,
        data: data,
        dataType : 'json',
        beforeSend : function () {
            $("#status").html('');
            d3.select("#results").selectAll('p').remove();
            d3.select("#results").append('p').html('<img src="/images/load.gif" alt="loading" />');
        },
        success : function (data) {
            if (onSuccess) {
                onSuccess(data);
            }
        },
        error : function (xhr, status, error) {
            if (onError) {
                onError(xhr.responseText);
            } else {
                addError(xhr.responseText);
            }
        },
        complete: function () {
            if (onComplete) {
                onComplete();
            }
        }
    });
}