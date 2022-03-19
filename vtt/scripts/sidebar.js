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


function drawsize(delta) {
    const mindraw = 1;
    const maxdraw = 3;

    draw_size += delta;
    draw_size = Math.max(mindraw, draw_size); // minimum is one
    draw_size = Math.min(maxdraw, draw_size); // maximum is 3
    
    console.log(draw_size);

    $("#decrease_drawsize").css("text-decoration", "underline");
    $("#increase_drawsize").css("text-decoration", "underline");
    $("#decrease_drawsize").css("cursor", "pointer");
    $("#increase_drawsize").css("cursor", "pointer");


    if (draw_size == mindraw) {
        $("#decrease_drawsize").css("text-decoration", "none");
        $("#decrease_drawsize").css("cursor", "default");
    } else if (draw_size == maxdraw) {
        $("#increase_drawsize").css("text-decoration", "none");
        $("#increase_drawsize").css("cursor", "default");
    }
}


function faq() {
    /* open the tutorial/faq */
    console.log('opening FAQ');
}


function io() {
    /* manage importing/exporting maps */
    console.log('opening IO menu');

}