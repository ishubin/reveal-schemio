Reveal Schemio Plugin
=========================

A [Reveal.js](https://github.com/hakimel/reveal.js) plugin for displaying [Schemio](https://schem.io) interactive animations.
It overrides `Right` and `Space` keys on the slides with Schemio player and sends configured events to the player, which lets you trigger interactive animations inside of your Reveal presentation slide.

Installing the plugin
------------------------

Download `reveal-schemio.css` and `reveal-schemio.js` files into the `plugins/reveal-schemio` folder in your Revealjs presentation project.

Before the Revealjs initializion script, load the `reveal-schemio.js` script and add `RevealSchemio` to the plugins array:

```html
<!-- ... -->
<script src="plugin/reveal-schemio/reveal-schemio.js"></script>
<script>
    Reveal.initialize({
        hash: true,
        plugins: [ RevealMarkdown, RevealHighlight, RevealNotes, RevealSchemio ]
    });
</script>
<!-- ... -->
```


Using Schemio player in your slides
-----------------------------------

First of all, you need to prepare an animation or demo in [Schemio](https://schem.io). Once you have created a public diagram with [Schemio](https://schem.io), you can click on `Embed diagram` option in the main menu and copy the generated player link. That link would be then used in the `schemio-player` container in your slide via `data-url` HTML attribute. Make sure to specify `schemio-player` class for the Schemio player container like in the example below. You may only use one player per slide.

```html
<div class="schemio-player" data-url="https://schem.io/embed/docs/USqkMRHEY7JZav9t"></div>
```

Make sure to add `reveal-schemio.css` files in your presentation deck `index.html` in the `<head>` section:

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

		<title>reveal.js</title>

		<link rel="stylesheet" href="dist/reset.css">
		<link rel="stylesheet" href="dist/reveal.css">
		<link rel="stylesheet" href="dist/theme/black.css">

		<!-- Theme used for syntax highlighted code -->
		<link rel="stylesheet" href="plugin/highlight/monokai.css">
		<link rel="stylesheet" href="plugin/reveal-schemio/reveal-schemio.css">
	</head>
	<body>
		<div class="reveal">
			<div class="slides">
            </div>
        </div>
    </body>
</html>
```


Here is an example of multiple Revealjs slides with Schemio player


```html
<div class="slides">
    <section>Slide 1</section>
    <section>
        <h3>Simple player</h3>
        <div class="schemio-player" data-url="https://schem.io/embed/docs/Br6TfmWI3wz1qOAJ"> </div>
    </section>

    <section>
        <h3>Another player</h3>
        <div class="schemio-player" data-url="https://schem.io/embed/docs/USqkMRHEY7JZav9t"> </div>
    </section>

    <section>Just a normal slide</section>
    <!-- ... -->
</div>
```


Intermediate Schemio animations withing the slide
-------------------------------------------------

`Reveal Schemio` plugin intercepts `Right` and `Space` keys for switching the slides and, if it is configured in specified Schemio player, it may instead send pre-configured events into the player, thus working as a sub-deck. This way you may create intermediate animations with their own frames before switching to next slide.

The following parameters can be used for controlling the Schemio events handling:

* `data-item-name` - (e.g. `GlobalEventHandler`) The name of the item in your Schemio document that is used for cross-communication between Revealjs deck and Schemio. This should be the item that implement all the custom event handlers.
* `data-frames` - (e.g. `4`) Specifies the total number of frames for Schemio player. NOTE: This property is ingored if `data-frame-events` is specified.
* `data-frame-prefix`  - (e.g. `Frame `) The animation frame event prefix. Used in combination with `data-frames` property and it generates Schemio events, by prepending the frame prefix to the frame number. So with a prefix `Frame ` and total frames of `3`, it will be sending the following frame events: `Frame 1`, `Frame 2` and `Frame 3`.
* `data-frame-events` - (e.g. `Init, Frame 1, Frame 2`) A comma separated list of all frame event names to be sent from Revealjs into Schemio player. NOTE: If this property is used, then `data-frames` and `data-frame-events` are ignored.
* `data-frame-end` - A name of a custom event that is triggered in the specified item (`data-item-name`) that should tell Revealjs deck to switch to the next sllide. This can be used if you want to be able to manage slide switching from inside the Schemio player.


Here is an example of a more complex Schemio animation:

```html
<div class="reveal">
    <div class="slides">
        <section>
            <h3>Player with events interception</h3>
            <div class="schemio-player"
                data-url="https://schem.io/embed/docs/0wgKzJg4RUI4z3a7"
                data-frames="4"
                data-frame-prefix="Frame "
                data-frame-end="Frame 5"
                data-item-name="GlobalEventHandler">
            </div>
        </section>
        <section>The end</section>
    </div>
</div>
```

Or the same but with the use of `data-frame-events`:

```html
<div class="reveal">
    <div class="slides">
        <section>
            <h3>Player with events interception</h3>
            <div class="schemio-player"
                data-url="https://schem.io/embed/docs/0wgKzJg4RUI4z3a7"
                data-frame-events="Frame 1, Frame 2, Frame 3, Frame 4"
                data-frame-end="Frame 5"
                data-item-name="GlobalEventHandler">
            </div>
        </section>
        <section>The end</section>
    </div>
</div>
```



License
---------

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.