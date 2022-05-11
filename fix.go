package main

import (
	"fmt"
	"golang.org/x/net/html"
	"os"
)

func main() {
	file, err := os.Open("dist/index.html")
	if err != nil {
		fmt.Println(err)
		return
	}

	root, err := html.Parse(file)
	if err != nil {
		fmt.Println(err)
		return
	}
	file.Close()
	os.Remove("dist/index.html")
	outfile, err := os.Create("dist/index.html")
	if err != nil {
		fmt.Println(err)
		return
	}

	rec(root)

	//	z := html.NewTokenizer(file)
	//	root := z.Token()
	//	for {
	//		tt := z.Next()
	//		if tt == html.ErrorToken {
	//			break
	//		}
	//
	//		if tt == html.StartTagToken {
	//			tok := z.Token()
	//			if tok.Data == "script" || tok.Data == "link" {
	//				for _, attr := range tok.Attr {
	//					if attr.Key == "src" ||attr.Key == "href" {
	//						// fmt.Printf("%v: %#v\n", tt, tok)
	//						attr.Val = "." + attr.Val
	//					}
	//				}
	//			}
	//		}
	//
	//	}

	html.Render(outfile, root)

}

func rec(n *html.Node) {
	if n.Type == html.ElementNode && (n.Data == "link" || n.Data == "script") {
		for i, a := range n.Attr {
			if a.Key == "href" || a.Key == "src" {
				if a.Val[0:4] != "http" {
					a.Val = "." + a.Val
					n.Attr[i] = a
					break

				}
			}
		}
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		rec(c)
	}
}
