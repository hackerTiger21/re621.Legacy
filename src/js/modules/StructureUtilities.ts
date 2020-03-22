declare var GM_addStyle;
declare var GM_getResourceText;

/**
 * StructureUtilities  
 * DOM changes that don't belong to any specific project
 */
export class StructureUtilities {

    public static createDOM() {
        // Load in the external stylesheet
        GM_addStyle(GM_getResourceText("re621_styles"));

        // Create a more sensible header structure
        let $menuContainer = $("nav#nav");
        let $menuMain = $("menu.main");

        if ($("nav#nav menu").length < 2) {
            $menuContainer.append(`<menu>`);
        }

        let $menuLogo = $("<menu>").addClass("logo desktop-only").html(`<a href="/" data-ytta-id="-">e621</a>`);
        $menuContainer.prepend($menuLogo);

        let $menuExtra = $("<menu>").addClass("extra");
        $menuMain.after($menuExtra);

        $("menu:last-child").addClass("submenu");

        // Create a modal container
        let $modalContainer = $("<re-modal-container>").prependTo("body");
    }
}
