var _yt_selectedRowId = null;

jQuery(document).ready( function() {
  loadDataGrid();
});

function loadDataGrid() {
  var grid = {};
  
  grid.autoencode = true;
  grid.autowidth = true;
  grid.caption = 'Assignments';
  grid.cellEdit = true;
  grid.cellsubmit = 'remote';
  grid.cellurl = '/MutateAssignment';
  grid.datatype = 'json';
  grid.editurl = '/MutateAssignment';
  grid.gridview = true; // This prevents us from using the afterInsertRow event callback.
  grid.height = '400px';
  grid.pager = '#pager';
  grid.rownumbers = true;
  grid.rowNum = 20;
  grid.sortname = 'id';
  grid.sortorder = 'desc';
  grid.url = '/GetAllAssignments';
  grid.viewrecords = true;
  
  grid.colNames = [];
  grid.colModel = [];
  
  grid.colNames.push('Assignment ID');
  grid.colModel.push({
    name: 'id', 
    index: 'id', 
    width: 70,
    searchoptions: {sopt: ['eq', 'ne', 'cn', 'nc']},
  });
  
  grid.colNames.push('Created On');
  grid.colModel.push({
    name: 'created', 
    index: 'created', 
    width: 150,
    search: false,
  });
  
  grid.colNames.push('Description');
  grid.colModel.push({
    name: 'description', 
    index: 'description', 
    width: 300,
    editable: true,
    edittype: 'textarea',
    editoptions: {rows:'3', cols: '30'},
    editrules: {required: true},
    searchoptions: {sopt: ['eq', 'ne', 'cn', 'nc']},
  });
  
  grid.colNames.push('Category');
  grid.colModel.push({
    name: 'category', 
    index: 'category', 
    width: 100,
    editable: true,
    cellurl: '/MutateAssignment',
    edittype: 'select',
    editoptions: {
      dataUrl: '/GetOptionsHTML?type=category',
    },
    editrules: {required: true},
    stype: 'select',
    searchoptions: {
      sopt: ['eq', 'ne'],
      dataUrl: '/GetOptionsHTML?type=category',
    },
  });
  
  grid.colNames.push('Status');  
  grid.colModel.push({
    name: 'status', 
    index: 'status', 
    width: 80,      
    editable: true,
    cellurl: '/MutateAssignment',
    edittype: 'select',
    editoptions: {
      dataUrl: '/GetOptionsHTML?type=status',
    },
    editrules: {required: true},
    stype: 'select',
    searchoptions: {
      sopt: ['eq', 'ne'],
      dataUrl: '/GetOptionsHTML?type=status',
    },
  });
  
  grid.colNames.push('# of Submissions');  
  grid.colModel.push({
    name: 'submissionCount',
    index: 'submissionCount',
    width: 60,
    search: false,
    sortable: false,
  });
  
  grid.colNames.push('Playlist ID');
  grid.colModel.push({
    name: 'playlistId', 
    index: 'playlistId', 
    width: 70,
    searchoptions: {sopt: ['eq', 'ne', 'cn', 'nc']},
  });
  
  grid.loadError = function(xhr, status, error) {
    showMessage('Could not load data: ' + xhr.statusText);
  };
  
  grid.beforeSelectRow = function(rowId) {
    _yt_selectedRowId = rowId;
    return true;
  };
  
  var jqGrid = jQuery('#datagrid').jqGrid(grid);
  
  var pagerParams = {
    addtext: 'Add',
    addtitle: 'Add a new assignment.',
    del: false,
    edittext: 'Edit',
    edittitle: 'Edit the currently selected assignment.',
    refreshtext: 'Refresh',
    refreshtitle: 'Refresh assignment list.',
    searchtext: 'Search',
    searchtitle: 'Search for a specific set of assignments.',
  };
  
  var editParams = {
    width: 350,
    closeAfterEdit: true,
    closeOnEscape: true,
  };
  
  var addParams = {
    width: 350,
    closeAfterAdd: true,
    closeOnEscape: true,
  };
  
  var deleteParams = {};
  
  var searchParams = {
    closeAfterSearch: true,
  };
  
  var viewParams = {};
  
  var codeParams = {
    caption: 'Embed Code',
    onClickButton: generateEmbedCode,
    position: 'last',
    title: 'Generate the embed code for the currently selected assignment.',
  };
  
  jqGrid.navGrid('#pager', pagerParams, editParams, addParams, deleteParams, searchParams,
		  viewParams).navButtonAdd('#pager', codeParams);
}

function getSelfUrl() {
  var protocol = document.location.protocol;
  var host = document.location.host;
  return protocol + '//' + host;
}

function generateEmbedCode() {
  
  if (_yt_selectedRowId == null) {
    showMessage("Please select an assignment's row first.");
    return;
  } 
  
  var selfUrl = getSelfUrl();
  
  jQuery.ui.dialog.defaults.bgiframe = true;
  
  var code = [];
  code.push('<script type="text/javascript" src="' + selfUrl + '/js/yaw-embed.js"></script>\n');
  code.push('<script type="text/javascript">\n');
  code.push('window.onload = function() {\n');   
  code.push('  var yaw = new Yaw();\n');
  code.push('  yaw.setAssignmentId("' + _yt_selectedRowId + '");\n');
  code.push('  yaw.setCallToAction("callToActionId");\n');  
  code.push('  var containerWidth = 300;\n');
  code.push('  var containerHeight = 300;\n');
  code.push('  yaw.setYawContainer("yawContainer", containerWidth, containerHeight);\n');   
  code.push('  yaw.ready();\n');
  code.push('};\n');  
  code.push('</script>\n');
  code.push('<img src"callToActionImage.jpg" id="callToActionId" />\n');  
  code.push('<div id="yawContainer" />');  
  
  code = code.join('');
  code = code.replace(/\</g,'&lt;');
  code = code.replace(/\>/g,'&gt;');
  
  var textarea = jQuery('<textarea/>');
  textarea.css('font-size', '11px');
  textarea.css('color', 'black');
  textarea.css('width', '100%');
  textarea.css('height', '300px');
  textarea.css('border', '0px');
  textarea.css('overflow', 'auto');
  textarea.html(code);
  
  var dialogOptions = {};
  dialogOptions.title = 'embed code';
  dialogOptions.width = 430;
  dialogOptions.height = 350;  
  
  var div = jQuery('<div/>');
  div.html(textarea);
  
  div.dialog(dialogOptions);   
  
  textarea.select();
}

function showMessage(text) {
  if (typeof console != 'undefined') {
    console.log(text);
  }
  
  jQuery('#message').html(text);
}