React Tutorial
==============


Development Setup Instructions
------------------------------

1. Install the node requirements.

        $ npm install

2. Create an empty `_comments.json` file.

        $ cat > _comments.json << EOF
        [
        ]
        EOF

3. Create a python virtual environment.

        $ virtualenv env
        $ source env/bin/activate

4. Install requirements.

        $ pip install -r requirements.txt


Running the Development Server and Gulp
---------------------------------------

After following the Development Setup Instructions, you can now run the Flask
dev server and gulp-watch to watch your JSX react file `src/comments.js` for
changes. If you have the [LiveReload][1] plugin for Chrome your browser will
automatically reload.

In your first terminal window or tab run:

    $ python app.py

In your second terminal window or tab run:

    $ gulp

Now you can open your browser to http://127.0.0.1:8000/ and you should be able to add comments.

[1]: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
