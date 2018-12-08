/**
 * 获取数据库中画布节点数据
 */
function loadLogicNodes() {
    $.ajax({
        type: "GET",
        url: "/ecm/logic/getAll",
        data: {caseID: cid},
        async: false,
        success: function (data) {
            loadData(data);
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

/**
 * 将画布节点数据保存至数据库中
 * @param data
 */
function saveLogicNodes(data) {
    $.ajax({
        type: "POST",
        url: "/ecm/logic/saveAll?caseID=" + cid,
        data: data,
        contentType: "application/json",
        success: function (data) {
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

/**
 * 查询根据频率统计推荐的法条数据
 * @param detail
 * @returns {Array}
 */
function queryFrequencyLaws() {
    var lawsDiv = $("#laws");
    lawsDiv.empty();
    $('#id_loading').show();
    var timer = setInterval(loadingDots, 1000);

    $.ajax({
        type: "GET",
        url: "http://114.212.240.10:8087/frequency",
        data: {content: cause, limit: 20},
        success: function (data) {
            var laws = [];
            for (var i = 0; i < data.length; i++) {
                laws.push(data[i].law);
            }

            $('#id_loading').hide();
            clearInterval(timer);
            prepareLawsDiv(lawsDiv, laws);
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

function queryLawSumLaws() {
    var lawsDiv = $("#laws");
    lawsDiv.empty();
    $('#id_loading').show();
    var timer = setInterval(loadingDots, 1000);

    $.ajax({
        type: "GET",
        url: "http://114.212.240.10:8087/lawSum",
        data: {cause: cause},
        success: function (data) {
            var laws = [];
            for (var i = 0; i < data.length; i++) {
                laws.push(data[i].law);
            }

            $('#id_loading').hide();
            clearInterval(timer);
            prepareLawsDiv(lawsDiv, laws);
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

function queryMindLaws(detail) {
    var lawsDiv = $("#laws");
    lawsDiv.empty();
    $('#id_loading').show();
    var timer = setInterval(loadingDots, 1000);

    $.ajax({
        type: "POST",
        url: "http://114.212.240.10:8088/query",
        data: {content: detail},
        success: function (data) {
            $('#id_loading').hide();
            clearInterval(timer);
            prepareLawsDiv(lawsDiv, eval(data));
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

function queryLawContent(law) {
    var content;
    $.ajax({
        type: "GET",
        url: "http://114.212.240.10:8087/law",
        async: false,
        data: {law: law},
        success: function (data) {
            content = data;
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
    return content;
}

function queryVagueArticles(input){
    $.ajax({
        type: "GET",
        url: "http://114.212.240.10:8087/law/vagueQuery",
        data: {input: input},
        success: function (data) {
            autoComParams.hints = data;
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}