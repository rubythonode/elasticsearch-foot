F.ui.status = function(status) {
	var color = 'text-success';
	
	if ( status == 'green' ) {
		color = 'text-success';
	} else if ( status == 'yellow' ) {
		color = 'text-warning';
	} else if ( status == 'red' ) {
		color = 'text-danger';
	} else {
		return status;
	}
	
	return '<i class="fa fa-circle ' + color + '"></i>';
}

F.ui.sortList = function(event, target, field, renderFunct) {
	if ( F.util.contains($(event.target).attr('class'), 'fa-chevron-down') ) {
		$FL[target].sort(F.util.sortByField(field, true));
		$(event.target).attr('class', 'fa fa-chevron-up sort-list');
	} else {
		$FL[target].sort(F.util.sortByField(field, false));
		$(event.target).attr('class', 'fa fa-chevron-down sort-list');
	}
	
	renderFunct();
};