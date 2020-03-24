import { Post, ViewingPost, PostRating } from "../../components/data/Post";
import { RE6Module } from "../../components/RE6Module";
import { Page, PageDefintion } from "../../components/data/Page";
import { HotkeyCustomizer } from "../general/HotkeyCustomizer";


/**
 * Add various symbols to the tilebar depending on the posts state
 */
export class PostViewer extends RE6Module {

    private static instance: PostViewer = new PostViewer();
    private post: ViewingPost;

    private constructor() {
        super(PageDefintion.post);
        if (!this.eval()) return;

        this.post = Post.getViewingPost();
        this.createDOM();

        this.registerHotkeys();
    }

    /** Creates the document structure for the module */
    private createDOM() {
        // Add the uploader name
        $("<li>")
            .append("Uploader: ")
            .append($("<a>").attr("href", "/users/" + this.post.getUploaderID()).text(this.post.getUploaderName()))
            .appendTo("#post-information ul");

        // Colorize the rating
        $("#post-information ul li:contains('Rating: ')")
            .html("Rating: ")
            .append($("<b>").text(PostRating.toString(this.post.getRating())).addClass("colorize-rating-" + this.post.getRating()));

        // Move the scoring block
        let $ratingContainer = $("<div>").attr("id", "image-score-links").prependTo("section#image-extra-controls");
        let postID = this.post.getId();
        let original = $("#post-vote-up-" + postID).parent().parent();

        $("#post-vote-down-" + postID).addClass("image-score-down").appendTo($ratingContainer);
        $("#post-score-" + postID).addClass("image-score-num").appendTo($ratingContainer);
        $("#post-vote-up-" + postID).addClass("image-score-up").appendTo($ratingContainer);

        original.remove();
    }

    /** Registers the module's hotkeys */
    public registerHotkeys() {
        HotkeyCustomizer.register(this.fetchSettings("hotkey_upvote"), function () {
            console.log("upvoting");
        });
        HotkeyCustomizer.register(this.fetchSettings("hotkey_downvote"), function () {
            console.log("downvoting");
        });
        HotkeyCustomizer.register(this.fetchSettings("hotkey_favorite"), function () {
            console.log("favoriting");
        });
    }

    /**
     * Returns a set of default settings values
     * @returns Default settings
     */
    protected getDefaultSettings() {
        return {
            hotkey_upvote: "a",
            hotkey_downvote: "z",
            hotkey_favorite: "f",
        };
    }

    /**
     * Returns a singleton instance of the class
     * @returns FormattingHelper instance
     */
    public static getInstance() {
        if (this.instance == undefined) this.instance = new PostViewer();
        return this.instance;
    }
}