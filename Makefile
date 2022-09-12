.SUFFIXES:

CC := hugo --minify
TEST := hugo server

SUBMOD_UPDATE := git submodule update --recursive

OUTPUT := html

INDEX_DIR := index
BLOG_DIR:= blog

.PHONY: all index blog clean test-index test-blog

# Build all.
all: index blog

# Build top page without blog.
index:
	$(SUBMOD_UPDATE)
	cd $(INDEX_DIR); $(CC) -d ../$(OUTPUT)

# Build blog site.
blog:
	$(SUBMOD_UPDATE)
	cd $(BLOG_DIR); $(CC) -d ../$(OUTPUT)/blog

# Serve top page without blog.
test-index:
	$(SUBMOD_UPDATE)
	cd $(INDEX_DIR); $(TEST)

# Serve blog site.
test-blog:
	$(SUBMOD_UPDATE)
	cd $(BLOG_DIR); $(TEST)

# Clean the generated product.
clean:
	rm -rf $(OUTPUT)
	@for f in $(shell git ls-files --other --ignored --exclude-standard); do\
		rm -rf $$f;\
	done
