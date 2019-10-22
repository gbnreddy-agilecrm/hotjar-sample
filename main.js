var innerHtml = "";
var user_id = 0;
var tenant_id = 0;
var widget_api_res = {};
var widget_data = {};


var jquery = document.createElement('script');
jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js';
document.getElementsByTagName("head")[0].appendChild(jquery);


var load_scr = document.createElement('script');
load_scr.src = 'https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js';
document.getElementsByTagName("head")[0].appendChild(load_scr);


var csslink = document.createElement('link');
csslink.href = 'https://social18.s3.us-east-2.amazonaws.com/style.css';
csslink.type = "text/css";
csslink.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(csslink);


function render() {
    $('#main_div').html("<div style='border: 1px solid #ddd;height: 100%;width: 100%;text-align: center;padding-top: 30px;padding-bottom: 30px;'><div><img src='https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif' style='width: 75px;'></div></div>");
}

function load_init_data(string_data) {
    widget_data = JSON.parse(atob(string_data));
    render();

    setTimeout(function () {
        var match = document.cookie.match(new RegExp('(^| )plug_token=([^;]+)'));
        if (match) {
            alert("token is  there so going to widget form");
            console.log(match[2]);
            get_configured_widgets();
        }
        else {
            alert("token is not there so going to login form");
           // debugger;
            login_prompt();
        }
    }, 1500);
}
function login_prompt() {
    //debugger;
    innerHtml = "";
    innerHtml = innerHtml + "<div style='border: 1px solid #ddd;background:" + widget_data.properties.background_check + ";height:100%;width:100%;background-repeat: no-repeat;background-size: cover;overflow: auto;background-position: center;padding-top: 20px;padding-bottom: 20px;\'>"
    innerHtml = innerHtml + '<div style="position: absolute;left: 3.2%;"><span style="font-size: 25px;color: #847971db;font-family: monospace;">500apps</span></div>'
    innerHtml = innerHtml + '<div class="form-style-2"  style="margin: auto;">'
    innerHtml = innerHtml + '<div class="form-style-2-heading">Plugins.ly  Login</div>'
    innerHtml = innerHtml + '<form action="" id="loginform">'
    innerHtml = innerHtml + '<label for="field2"><span>Email <span class="required">*</span></span><input type="text" class="input-field" name="email" value="" /></label>'
    innerHtml = innerHtml + '<label for="field3"><span>Password <span class="required">*</span></span><input class="input-field" name="password" value="" type="password"/></label>'
    innerHtml = innerHtml + '</form>'
    innerHtml = innerHtml + '<button style="display: inline-block;padding: 5px 17px; font-size: 15px;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #fff;background-color: deepskyblue;border: none;border-radius: 15px;margin-left: 100px;" onclick="login_app_check()">Submit</button>'
    innerHtml = innerHtml + '<button style="display: inline-block;padding: 5px 17px;font-size: 15px;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #000;background-color: #fff;border: 1px solid #ddd;border-radius: 15px;margin-left: 10px;background: #f9f7f7;" onclick="helper_text()">Cancel</button>'
    innerHtml = innerHtml + '</div>'
    innerHtml = innerHtml + '</div>'

    $("#main_div").html(innerHtml);

}
function helper_text() {
    innerHtml = "";
    innerHtml = innerHtml + "<div style='border: 1px solid #ddd;height: 100%;width: 100%;text-align: center;font-family: serif;padding-top: 30px;padding-bottom: 30px;'>YOUR WIDGET WILL LOAD HERE</div>"
    $("#main_div").html(innerHtml);
}
function login_app_check() {
    event.preventDefault();
    var x = $("form").serializeArray();
    console.log(x);
    var json = { "appname": "flow" };
    $.each(x, function (i, field) {
        json[field.name] = field.value
    });
    console.log(json);

    _ajaxcall({ "type": "POST", "url": "https://pluginsdev.500apps.com/plugins/userToken", "data": json, "form": "login" });
}

function _ajaxcall(obj) {
    if (obj.form == 'wdgt_after_data') {
        $('#view_div').html("<div style='border: 1px solid #ddd;height: 100%;width: 100%;text-align: center;padding-top: 30px;padding-bottom: 30px;'><div><img src='https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif' style='width: 75px;'></div></div>");
    } else {
        render();
    }
    $.ajax({
        type: obj.type,
        url: obj.url,
        data: obj.data,
        success: function (data, text) {
            if (obj.form == "login") {
                console.log(data);
                user_id = data.user_id;
                tenant_id = data.tenant_id;
                document.cookie = "plug_token=" + data.token;
                get_configured_widgets();
            } else if (obj.form == "after_load_apps") {
                display_configured_widgets(data);
            }
            else if (obj.form == "widget_auth") {
                prepare_wdgt_ui(data, obj.app_id, obj.app_name);
            } else if (obj.form == "after_cards_load") {
                display_apps_cards_ui(data, obj.app_id, obj.app_name);
            }
            else if (obj.form == "post_after_wdap") {
                get_configured_widgets();
            } else if (obj.form == "wdgt_after_data") {
                widget_api_res = data;
                filter_response();
            }
        },
        error: function (request, status, error) {
            if (obj.form == "login") {
                alert("Check ur credentials");
            }
        }
    });

}
function get_configured_widgets() {
    _ajaxcall({ "type": "GET", "url": "https://pluginsdev.500apps.com/plugins/getActiveApps/" + user_id, "data": {}, "form": "after_load_apps" });
}
function display_configured_widgets(data) {
    console.log(data);
    var clr = "";
    innerHtml = "";
    innerHtml = innerHtml + "<div style='border: 1px solid #ddd;background:" + widget_data.properties.background_check + ";height: 100%;width: 100%;background-repeat: no-repeat;background-size: cover;overflow: auto;background-position: center;padding-top: 20px;padding-bottom: 20px;\'>"
    innerHtml = innerHtml + '<div id="mainbox">'
    innerHtml = innerHtml + '<div style="position: absolute;left: 3.2%;"><span style="font-size: 25px;color: #847971db;font-family: monospace;">Plugins</span></div>'
    for (var i = 0; i < data.length; i++) {
        clr = "";
        if (data[i].status == "Manage") {
            clr = "#8df56c54";
        } else {
            clr = "#e6e2e27a";
        }
        innerHtml = innerHtml + '<div class="card">'
        innerHtml = innerHtml + '<div style="height: 70%;"><img src="' + data[i].app_logo_url + '" style="height: 100%;width: 100%;"></div>'
        innerHtml = innerHtml + '<div style="text-align: center;margin-top: 22px;background:' + clr + ';padding: 12px;margin-left: -10px;margin-right: -10px;color: #000;cursor: pointer;" onclick="display_widgt_loginform(\'' + data[i].id + '\',\'' + data[i].generated_key + '\',\'' + data[i].created_by + '\',\'' + data[i].domain_id + '\',\'' + data[i].status + '\',\'' + data[i].name + '\',\'' + data[i].type + '\')">' + data[i].status + '</div>'
        innerHtml = innerHtml + '</div>'
    }
    innerHtml = innerHtml + '</div>'
    innerHtml = innerHtml + '</div>'

    $("#main_div").html(innerHtml);

}
function display_widgt_loginform(app_id, generated_key, created_by, domain_id, status, app_name, app_type) {
    if (status == 'Manage') {
        get_apps_cards(app_id, app_name);
    } else {
        if (app_type == "Oauth") {
            alert("salem");
            prepare_oauth(app_id, app_name, generated_key, created_by, domain_id);
        } else {
            _ajaxcall({ "type": "GET", "url": "https://pluginsdev.500apps.com/plugins/get/" + app_id, "data": {}, "form": "widget_auth", "app_id": app_id, "app_name": app_name });
        }
    }
}
function prepare_oauth(app_id, app_name, generated_key, created_by, domain_id) {
    alert(app_id + "" + app_name);
    innerHtml = "";
    var innerform = "";
    innerHtml = innerHtml + "<div style='border: 1px solid #ddd;background:" + widget_data.properties.background_check + ";height: 100%;width: 100%;background-repeat: no-repeat;background-size: cover;overflow: auto;background-position: center;padding-top: 20px;padding-bottom: 20px;\'>"
    innerHtml = innerHtml + '<div style="position: absolute;left: 3.2%;"><span style="font-size: 30px;color: #676363db;">' + app_name + '</span></div>'
    innerHtml = innerHtml + '<div class="form-style-2"  style="margin: auto;">'
    innerHtml = innerHtml + '<div class="form-style-2-heading">Some apps agrement texts and connections logos</div>'
    innerHtml = innerHtml + '<div><button style="display: inline-block;padding: 5px 17px; font-size: 15px;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #fff;background-color: deepskyblue;border: none;border-radius: 15px;" onclick="gotoconsole(\'' + app_id + '\',\'' + app_name + '\',\'' + generated_key + '\',\'' + created_by + '\',\'' + domain_id + '\')">Click to go</button></div>'
    innerHtml = innerHtml + "</div>"
    innerHtml = innerHtml + "</div>"
    $("#main_div").html(innerHtml);

}

function gotoconsole(app_id, app_name, generated_key, created_by, domain_id) {
    alert("test");
    //window.open("https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https://flow.500apps.com/oAuth/callBack&prompt=consent&response_type=code&client_id=539684438713-uu6bcv9hq65fmr3b5q2ecmg93u92hqdq.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/calendar&access_type=offline","_blank","width=650, height=650");
    var windowObj;
    window.open("https://pluginsdev.500apps.com/plugins/Oauth54671?appId=" + app_id + "&u_id=" + created_by + "&name=" + app_name + "&domain_id=" + domain_id + "&generated_key=" + generated_key, "_blank", "width=650, height=650");

    //window.windowObj = get_configured_widgets();
}
function get_apps_cards(app_id, app_name) {
    _ajaxcall({ "type": "GET", "url": "https://pluginsdev.500apps.com/plugins/get_cards/" + app_id, "data": {}, "form": "after_cards_load", "app_id": app_id, "app_name": app_name });
}
function display_apps_cards_ui(data, app_id, app_name) {
    console.log(data);
    innerHtml = "";
    innerHtml = innerHtml + "<div style='border: 1px solid #ddd;background:" + widget_data.properties.background_check + ";height: 100%;width: 100%;background-repeat: no-repeat;background-size: cover;overflow: auto;background-position: center;padding-top: 20px;padding-bottom: 20px;\'>"
    innerHtml = innerHtml + "<div id='mainbox'>"
    innerHtml = innerHtml + '<div style="position: absolute;left: 3.2%;margin-top: -30px;"><span style="font-size: 51px;cursor: pointer;color: deepskyblue;" onclick="get_configured_widgets()">â†</span><span style="font-size: 20px;color: #847971db;font-family: monospace;">' + app_name + ' Cards</span></div>'
    for (var i = 0; i < data.length; i++) {
        innerHtml = innerHtml + '<div style="text-align: center;font-size: 18px; color: #777264;">'
        innerHtml = innerHtml + '<div class="round_card">'
        innerHtml = innerHtml + '<div style="height: 100%;cursor: pointer;" onclick="display_widget_ui(\'' + data[i].card_id + '\',\'' + data[i].id + '\')"><img src="' + data[i].card_desc + '" style="height: 100%;width: 100%;"></div>'
        innerHtml = innerHtml + "</div>"
        innerHtml = innerHtml + '<div>' + data[i].card_name + '</div>'
        innerHtml = innerHtml + "</div>"
    }
    innerHtml = innerHtml + "</div>"
    innerHtml = innerHtml + "</div>"
    innerHtml = innerHtml + "<div style='padding:25px;margin:20px' id='view_div'><div style='border: 1px solid #ddd;height: 100%;width: 100%;text-align: center;padding-top: 30px;padding-bottom: 30px;'><div><img src='https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif' style='width: 75px;'></div></div></div>"

    $("#main_div").html(innerHtml);
}
function display_widget_ui(card_id, app_id) {
    _ajaxcall({ "type": "GET", "url": "https://pluginsdev.500apps.com/plugins/get_data/" + card_id + "/" + user_id + "/" + app_id, "data": {}, "form": "wdgt_after_data" });
}
function prepare_wdgt_ui(data, app_id, app_name) {
    innerHtml = "";
    var innerform = "";
    innerHtml = innerHtml + "<div style='border: 1px solid #ddd;background:" + widget_data.properties.background_check + ";height: 100%;width: 100%;background-repeat: no-repeat;background-size: cover;overflow: auto;background-position: center;padding-top: 20px;padding-bottom: 20px;\'>"
    innerHtml = innerHtml + '<div style="position: absolute;left: 3.2%;"><span style="font-size: 30px;color: #676363db;">' + app_name + '</span></div>'
    $.each(JSON.parse(data.app_fields).fields, function (i, field) {
        innerform = innerform + '<label for="field2"><span>' + field.label + ' <span class="required">*</span></span>'
        if (field.name != 'Password') {
            innerform = innerform + '<input type="text" class="input-field" name="' + field.name + '" value="" />'
        } else {
            innerform = innerform + '<input type="' + field.name + '" class="input-field" name="' + field.name + '" value="" />'
        }
        innerform = innerform + '</label>';
    });
    innerHtml = innerHtml + '<div class="form-style-2" style="margin: auto;">'
    innerHtml = innerHtml + '<div class="form-style-2-heading">App credentials</div>'
    innerHtml = innerHtml + '<form action="" id="wdgt_app_log">'
    innerHtml = innerHtml + innerform
    innerHtml = innerHtml + '</form>'
    innerHtml = innerHtml + '<button style="display: inline-block;padding: 5px 17px; font-size: 15px;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #fff;background-color: deepskyblue;border: none;border-radius: 15px;margin-left: 100px;" onclick="post_wdgt_app_credentials(' + app_id + ')">Submit</button>'
    innerHtml = innerHtml + '<button style="display: inline-block;padding: 5px 17px;font-size: 15px;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #000;background-color: #fff;border: 1px solid #ddd;border-radius: 15px;margin-left: 10px;background: #f9f7f7;" onclick="get_configured_widgets()">Cancel</button>'
    innerHtml = innerHtml + '</div>'
    innerHtml = innerHtml + '</div>'
    $("#main_div").html(innerHtml);
}
function post_wdgt_app_credentials(app_id) {
    event.preventDefault();
    var x = $("form").serializeArray();
    console.log(x);
    var json = {};
    $.each(x, function (i, field) {
        json[field.name] = field.value
    });
    var data = 'fields=' + JSON.stringify(json) + '&status=Manage';
    _ajaxcall({ "type": "PUT", "url": "https://pluginsdev.500apps.com/plugins/updateFields/" + app_id + "/" + user_id, "data": data, "form": "post_after_wdap" });
}
function get_widget_data() {
    _ajaxcall({ "type": "GET", "url": "https://pluginsdev.500apps.com/plugins/get_data/" + widget_data.card_id + "/" + user_id + "/" + widget_data.app_id, "data": {}, "form": "wdgt_after_data" });
}
function filter_response() {
    var is_str = widget_api_res.is_str;
    var path_array = widget_api_res.path_array.split(",");//['first_name', 'last_name', 'email'];
    var obj_path = {};
    if (Object.entries(widget_api_res.obj_path).length === 0 && widget_api_res.obj_path.constructor === Object) {
        obj_path = {};
    } else {
        obj_path = JSON.parse(widget_api_res.obj_path.replace(/'/g, '"'));
    }
    //{ 'properties': 'properties' };

    var path_obj = widget_api_res.path_obj;//[{ "properties.0.name": "properties.0.value" }, { "properties.1.name": "properties.1.value" }, { "properties.2.name": "properties.2.value" }];
    var is_key = widget_api_res.is_key;

    var json = JSON.parse(widget_api_res.json_obj);
    if (Array.isArray(json)) {
        json_array = json;
    } else {

        for (h in obj_path) l = h
        var t = " json." + h
        if (obj_path[h] == "") {
            //json_array = json_obj[h];
            json_array = _(eval(t)).flatMap().value();
        }
        else {
            json_array = _(eval(t)).flatMap(_.property(obj_path[h])).value();
        }
    }

    new_json_array = []

    for (var i = 0; i < json_array.length; i++) {
        var obj = {}
        if (is_str == 1) {
            for (var k = 0; k < path_array.length; k++) {
                obj[path_array[k]] = json_array[i][path_array[k]];

            }
            console.log(obj, "obj");
        } else {
            for (var k = 0; k < path_array.length; k++) {
                var path_key;
                for (v in path_obj[k]) path_key = v
                var check_key = _(json_array).flatMap(_.property(path_key)).value();
                if (check_key[i] == path_array[k] || is_key) {
                    obj[path_array[k]] = _(json_array).flatMap(_.property(path_obj[k][v])).value()[i];
                } else {
                    obj[path_array[k]] = "";
                }
            }
        }

        new_json_array.push(obj)
    }
    prepare_widget_ui(new_json_array);

}
function perform_action() {
    $("#panel").slideToggle("slow");
}
function prepare_widget_ui(res_obj) {

    var sub_el = "";
    console.log(res_obj);
    var in_html = "";
    in_html = in_html + "<div style='border: 1px solid #ddd;margin: 10px;padding: 5px;background: #50c7ff;border-radius: 15px;color: white;padding-left: 15px;padding-right: 10px;box-shadow: 1px 5px 5px #b2dff1;cursor: pointer;' id='flip' onclick='perform_action()'>Get Code</div>"
    in_html = in_html + '<div id="panel" style="display: none !important;z-index: 100;position: absolute;margin: auto;left: 1110px;top: 338px;display: block;">'
    in_html = in_html + '<table style="background:#eadabc;;sborder: 1px solid #ddd;text-align: left;border-collapse: collapse;width: 100%;">'
    in_html = in_html + '<tr>'
    in_html = in_html + '<td style=" border: 1px solid #ddd;text-align: left;padding: 15px;"><b>HTML</b></td>'
    in_html = in_html + '<td style=" border: 1px solid #ddd;text-align: left;padding: 15px;">&lt;div id="main_q"&gt;Widegt will load Here &lt;/div&gt;</td>'
    in_html = in_html + '</tr>'
    in_html = in_html + '<tr>'
    in_html = in_html + '<td style=" border: 1px solid #ddd;text-align: left;padding: 15px;"><b>JAVASCRIPT CODE</b></td>'
    in_html = in_html + '<td style=" border: 1px solid #ddd;text-align: left;padding: 15px;"> &lt;script src="https://social18.s3.us-east-2.amazonaws.com/saljqu.js"&gt;&lt;/script&gt;</td>'
    in_html = in_html + '</tr>'
    in_html = in_html + '<tr>'
    in_html = in_html + '<td style=" border: 1px solid #ddd;text-align: left;padding: 15px;"><b>INIT METHOD</b></td>'
    in_html = in_html + '<td style=" border: 1px solid #ddd;text-align: left;padding: 15px;">load_init_data("some key");</td>'
    in_html = in_html + '</tr>'
    in_html = in_html + '</table>'
    in_html = in_html + '</div>'
    sub_el = "<div style='display: -webkit-box;'><div style='text-align:center;font-size: 20px;color: #099ffd;font-weight: bold;padding: 10px;width: 90%;'>Widget preview</div>" + in_html + "<div></div></div><div style='border: 1px solid #ddd;background:" + widget_data.properties.background_check + ";height: 100%;width: 100%;background-repeat: no-repeat;background-size: cover;overflow: auto;background-position: center;\'>"
    if ('' + widget_data.properties.view + '' == 'Table') {
        sub_el = sub_el + '<table style=" border: 1px solid #ddd;background: white;text-align: left;border-collapse: collapse;width: 100%;">';
        for (var t = 0; t < res_obj.length; t++) {
            if (t == 0) {
                sub_el = sub_el + '<tr>'
                for (var key in res_obj[0]) {
                    sub_el = sub_el + '<th style=" border: 1px solid #ddd;text-align: left;padding: 15px;">' + key + '</th>';
                }
                sub_el = sub_el + '</tr>'
            }
            sub_el = sub_el + '<tr>'
            for (var key in res_obj[t]) {
                sub_el = sub_el + '<td style=" border: 1px solid #ddd;text-align: left;padding: 15px;">' + res_obj[t][key] + '</td>';
            }
            sub_el = sub_el + '</tr>'
        }
        sub_el = sub_el + '</table >';
        console.log(sub_el);
    } else if ('' + widget_data.properties.view + '' == 'List') {
        sub_el = sub_el + '<ul style="padding:10px">'
        for (var t = 0; t < res_obj.length; t++) {
            var data = "<li style='padding:5px'>Data  " + t
            for (var key in res_obj[t]) {
                if (res_obj[t][key] == "") {
                    data = data + "<ol>No data_______</ol>"
                } else {
                    data = data + "<ol>" + res_obj[t][key] + "</ol>"
                }
            }
            data = data + "</li>"
            sub_el = sub_el + data;
        }

        sub_el = sub_el + '</ul>'
    }
    else {
        sub_el = sub_el + '<div style="display: -webkit-box;margin: 10px;width:100%">'
        for (var t = 0; t < res_obj.length; t++) {
            10
            var data = ""; 10
            data = data + '<div style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;width: 28%;height:235px;margin:10px;b10ackground: white;"> <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" style="width:100%;height:50%"><div style="padding: 2px 16px;">'
            var p = "";
            for (var key in res_obj[t]) {
                p = p + '<div>' + res_obj[t][key] + '</div>'
            }
            sub_el = sub_el + data + p + '</div></div>'
        }
        sub_el = sub_el + '</div>'


    }
    sub_el = sub_el + '</div>'
    $("#view_div").html(sub_el);
}
function postFunction(test) {
    alert(test);
    parent.postMessage(data, "*");
}