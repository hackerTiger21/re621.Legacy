import { Page, PageDefintion } from "../../components/data/Page";
import { Post } from "../../components/data/Post";
import { RE6Module, Settings } from "../../components/RE6Module";

export class CustomFlagger extends RE6Module {

    public constructor() {
        super([PageDefintion.search, PageDefintion.post]);
    }

    protected getDefaultSettings(): Settings {
        return {
            enabled: true,
            flags: [
                { name: "CHARS", color: "#800000", tags: "-solo -duo -group -zero_pictured" },
                { name: "TAGS", color: "#008000", tags: "tagcount:<5" },
                { name: "SEXES", color: "#000080", tags: "-zero_pictured -male -female -herm -maleherm -andromorph -gynomorph -intersex -ambiguous_gender" },
            ],
        };
    }

    public create(): void {

        const postContainer = $("div#page");

        if (Page.matches(PageDefintion.post)) this.createPostPage();
        else if (Page.matches(PageDefintion.search)) {

            const flagData = this.fetchSettings<FlagDefinition[]>("flags");
            const thumbnails = postContainer.find<HTMLElement>("article.post-preview, div.post-preview").get();
            for (const thumb of thumbnails) {
                CustomFlagger.modifyThumbnail($(thumb), flagData);
            }
        }
    }

    protected createPostPage(): void {
        // Parse the post for active flags
        const flagData = this.fetchSettings<FlagDefinition[]>("flags"),
            post = Post.getViewingPost(),
            activeFlags: string[] = [];

        for (const flag of flagData) {
            if (CustomFlagger.tagsMatchFilter(post, flag.tags.split(" ")))
                activeFlags.push(`<span class="custom-flag-title" style="background-color: ${flag.color}">${flag.name}</span> ${flag.tags}`);
        }

        // Display the flags if any are active
        if (activeFlags.length == 0) return;

        const flagContainer = $("<div>")
            .insertAfter("div.input#tags-container");

        $("<b>")
            .html("Flags")
            .addClass("display-block")
            .appendTo(flagContainer);

        activeFlags.forEach((entry) => {
            $("<div>")
                .addClass("custom-flag")
                .html(entry)
                .appendTo(flagContainer);
        });
    }

    private static tagsMatchFilter(post: Post, filter: string[]): boolean {
        for (const entry of filter) {
            if (entry.startsWith("-")) {         // negation
                return !post.hasTag(entry.substr(1));
            } else if (entry.startsWith("~")) {  // optional
                // TODO Implement optional tag handling
                return post.hasTag(entry.substr(1));
            } else {                            // generic
                return post.hasTag(entry);
            }
        }

        return true;
    }

    public static async modifyThumbnail($article: JQuery<HTMLElement>, flagData: FlagDefinition[]): Promise<void> {

        /* Create the structure */
        const $img = $article.find("img"),
            post = new Post($article);

        // Image not wrapped in picture - usually on comment pages and the like
        let $picture = $article.find("picture");
        if ($picture.length == 0) $picture = $("<picture>").insertAfter($img).append($img);

        /* Determine active flags */
        const activeFlags: JQuery<HTMLElement>[] = [];

        for (const flag of flagData) {
            if (CustomFlagger.tagsMatchFilter(post, flag.tags.split(" ")))
                activeFlags.push(
                    $("<span>")
                        .addClass("custom-flag-thumb")
                        .html(flag.name)
                        .css("background-color", flag.color)
                );
        }

        /* Flag Elements */
        const flagContainer = $("<div>")
            .addClass("flag-container")
            .appendTo($picture);

        // Display the flags if any are active
        if (activeFlags.length == 0) return;

        activeFlags.forEach((entry) => {
            entry.appendTo(flagContainer);
        });
    }

}

export interface FlagDefinition {
    name: string;
    color: string;
    tags: string;
}
