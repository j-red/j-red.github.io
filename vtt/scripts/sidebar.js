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


var faq_open = false;
const faq = $("#faq");
function toggle_faq() {
    /* open the tutorial/faq */
    faq_open = !faq_open;

    if (faq_open) {
        console.log('opening FAQ'); 
        $("#faq").css("display", "block");
    } else {
        console.log('closing FAQ'); 
        $("#faq").css("display", "none");
    }
}


var io_open = false;
const io = $("#io-menu");

$(".overlay-box").on("click", function(event){ 
    // prevent child elem clicks from clicking parent
    event.stopPropagation();
    console.log( "I was clicked, but my parent will not be." );
});

function toggle_io() {
    /* manage importing/exporting maps */
    io_open = !io_open;

    if (io_open) {
        console.log('opening IO menu'); 
        $("#io-menu").css("display", "block");
    } else {
        console.log('closing IO menu'); 
        $("#io-menu").css("display", "none");
    }

}

// $("#overlay-box").on("click", function(event){
//     event.stopPropagation();
//     console.log( "I was clicked, but my parent will not be." );
// });


// function stop_prop(event){
//     event.stopPropagation();
//     console.log( "I was clicked, but my parent will not be." );
// }