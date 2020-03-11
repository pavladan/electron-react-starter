import React, { useState } from "react";
import Helmet from "react-helmet";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("en");
	const [title, setTitle] = useState("Home");
	
  return (
    <div className="App">
      <Helmet>
        <html lang={lang}></html>
        <body className={theme}></body>
				<title>{title}</title>
      </Helmet>
      Hello World
    </div>
  );
}
