build:
	elm-make Main.elm --output=index.html

deploy:
	git checkout gh-pages
	git pull origin master
	make build
	git add -f index.html
	git commit -m "make deploy"
	git push
	git checkout master

