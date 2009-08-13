jQuery(document).ready( function() {
	if (window.isLoggedIn) {		
		jQuery('#tabs').tabs();		
		init();
	}
});

function init() {
	getAllSubmissions();
}

function initDataGrid(data) {	
	var grid = {};
	grid.datatype = 'local';
	grid.height = 400;
	grid.multiselect = false;
	grid.caption = 'Video Submissions';
	grid.rowNum = 10;
	grid.rowList = [10,20,30]; 
	
	grid.colNames = [];
	grid.colModel = [];
	
	grid.colNames.push('Last Updated');
	grid.colModel.push({name: 'updated', index: 'updated', width: 200, sorttype: 'date', editable: true});
	
	grid.colNames.push('Video ID');
	grid.colModel.push({name: 'videoId', index: 'videoId', width: 100, sorttype: 'string', editable: true});

	grid.colNames.push('Assignment ID');
	grid.colModel.push({name: 'assignmentId', index: 'assignmentId', width: 100, sorttype: 'string', editable: true});	
	
	grid.colNames.push('Article URL');
	grid.colModel.push({name: 'articleUrl', index: 'articleUrl', width: 200, sorttype: 'string', editable: true});	
	
	grid.colNames.push('Title');
	grid.colModel.push({name: 'title', index: 'title', width: 150, sorttype: 'string', editable: true, editoptions:{size:"20",maxlength:"30"}});
	
	grid.colNames.push('Description');
	grid.colModel.push({name: 'description', index: 'description', width: 200, sorttype: 'string', editable: true});
	
	grid.colNames.push('Tags');
	grid.colModel.push({name: 'tags', index: 'tags', width: 150, sorttype: 'string', editable: true});
	
	grid.colNames.push('Uploader');
	grid.colModel.push({name: 'uploader', index: 'uploader', width: 100, sorttype: 'string', editable: true});	
	
	grid.colNames.push('Approval Status');	
	grid.colModel.push({name: 'status', index: 'status', width: 100, sorttype: 'string',			
			editable: true, edittype:"select", 
			editoptions: {value: '0:unreviewed;1:approved;2:rejected'}});				
	
	grid.onSelectRow = function(id){ 
		if(id && id!==lastsel) { 
			jQuery('#datagrid').restoreRow(lastsel); 
			jQuery('#datagrid').editRow(id,true); 
			lastsel=id; 
		}
	};
	
	grid.editurl = 'server.php'; 		
	
	grid.pager = jQuery('#pager');	
	
	var jqGrid = jQuery("#datagrid").jqGrid(grid);
	
	for(var i = 0; i <= data.length; i++) {
		jqGrid.addRowData(i + 1, data[i]); 	
	}
	
	/*
	var pager = jQuery("#datagrid").navGrid('#pager',{
        edit:true,add:false,del:false,search:false
    })	

	pager.navButtonAdd('#pager', {caption: 'Preview Video', onClickButton: function() {
		var selectedRow = jqGrid.getGridParam("selrow");

	}});	
	*/
	
}

function processData(data) {	
	
	data = data;
	
	for (var i = 0; i < data.length; i++) {
		var entry = data[i];
		entry.status = statusToString(entry.status);
		entry.updated = new Date(entry.updated);
	}
	
	return data;
}

function statusToString(status) {
	
	var newStatus = 'unreviewed';
	
	switch (status) {
		case 0:
			newStatus = 'unreviewed';
			break;
		case 1:
			newStatus = 'approved';
			break;
		case 2:
			newStatus = 'rejected';
			break;
	}
	
	return newStatus;	
}

function getAllSubmissions() {
	var url = '/GetAllSubmissions';
	var ajaxCall = {};
	ajaxCall.cache = false;
	ajaxCall.type = 'GET';
	ajaxCall.url = url;
	ajaxCall.dataType = 'json';
	ajaxCall.success = function(entries) {			
		entries = processData(entries);		
		initDataGrid(entries);
		showLoading(false);
	};	
	showLoading(true);
	jQuery.ajax(ajaxCall);	
}

function showLoading(status) {
	if (status) {
		jQuery('#status').html("loading ...");		
	} else {
		jQuery('#status').empty();		
	}
	
}

function displayVideo(videoId) {
	
	jQuery('#videoDisplay').html('loading video ...');
	
	var youtubeUrl = 'http://www.youtube.com/v/' + videoId;
	
	var html = [];
	html.push('<object width="250" height="200">');
	html.push('<param name="movie" value="');
	html.push(youtubeUrl);
	html.push('&hl=en&fs=1&"></param>');
	html.push('<param name="allowFullScreen" value="true"></param>');
	html.push('<param name="allowscriptaccess" value="always"></param>');
	html.push('<embed src="');
	html.push(youtubeUrl);
	html.push('&hl=en&fs=1&" type="application/x-shockwave-flash"');
	html.push(' allowscriptaccess="always" allowfullscreen="true" width="250" height="200">');
	html.push('</embed></object>');	
	
	jQuery('#videoDisplay').html(html.join(''));
}
