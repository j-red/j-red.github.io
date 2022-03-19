function right_sidebar(id) {
    // console.log(`Button ${id} pressed`);
    if ($(`#` + id).hasClass('focused')) {
        // remove focus
        $(`#` + id).removeClass('focused');

        // ensure no element is treated as active
        rightsidebar_active = null;
    } else {
        // remove focus from siblings
        $(`#` + id).siblings('.focused').removeClass('focused');

        // add focus to self
        $(`#` + id).addClass('focused'); 

        // update global active element 
        rightsidebar_active = id;
    }
}