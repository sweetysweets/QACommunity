/**
 * Created by deng on 2018/3/19.
 */
function validateAddModal() {
    var result = true;
    var topic = $("#node-add-topic-input").val();
    var detail = $("#node-add-detail-input").val();
    result = _validateTopic(result, topic);
    result = _validateDetail(result, detail);
    return result;
}

// function validatePanelSave(graphModel) {
//     var result = LogicValidate.OK;
//     var id = $("#panel-id-input").val();
//     var topic = $("#panel-topic-input").val();
//     var detail = $("#panel-detail-input").val();
//     var type = $("#panel-type-select").val();
//
//     result = LogicValidator._validateTopic(result, topic);
//     result = LogicValidator._validateDetail(result, detail);
//     result = LogicValidator._validateType(result, type, id, graphModel);
//
//     return result;
// }

// function validateEditModal(graphModel) {
//     var result = LogicValidate.OK;
//     var id = $("#node-edit-id-input").val();
//     var topic = $("#node-edit-topic-input").val();
//     var detail = $("#node-edit-detail-input").val();
//     var type = $("#node-edit-type-select").val();
//
//     result = LogicValidator._validateTopic(result, topic);
//     result = LogicValidator._validateDetail(result, detail);
//     result = LogicValidator._validateType(result, type, id, graphModel);
//
//     return result;
// }

function _validateTopic(baseCode, topic) {
    if (!topic || topic.length == 0) {
        return (baseCode + LogicValidate.TOPIC_EMPTY);
    } else if (topic.length > LogicTextLimit.TOPIC) {
        return (baseCode + LogicValidate.TOPIC_TOO_LONG);
    } else {
        return baseCode;
    }
}

function _validateDetail(baseCode, detail) {
    if (!detail || detail.length == 0) {
        return (baseCode + LogicValidate.DETAIL_EMPTY);
    } else if (detail.length > LogicTextLimit.DETAIL) {
        return (baseCode + LogicValidate.DETAIL_TOO_LONG);
    } else {
        return baseCode;
    }
}

function _validateType(baseCode, typeSelected, id, graphModel) {
    var node = graphModel.findNodeById(id);
    if (node && node.type != LogicNodeType.FINAL_CONCLUSION && typeSelected == LogicNodeType.FINAL_CONCLUSION) {
        return (baseCode + LogicValidate.DUPLICATE_ROOT);
    } else {
        return baseCode;
    }
}

// 生成提示语句
function generateHint(checkCode) {
    var hint = "";
    if ((checkCode & LogicValidate.TOPIC_EMPTY) != 0) {
        hint += "请填写摘要。"
    }
    if ((checkCode & LogicValidate.TOPIC_TOO_LONG) != 0) {
        hint += "摘要太长。"
    }
    if ((checkCode & LogicValidate.DETAIL_EMPTY) != 0) {
        hint += "请填写详情。"
    }
    if ((checkCode & LogicValidate.DETAIL_TOO_LONG) != 0) {
        hint += "详情太长。"
    }
    if ((checkCode & LogicValidate.DUPLICATE_ROOT) != 0) {
        hint += "只能有一个最终结论。"
    }

    return hint;
}