defmodule CowboyAndNpm.TopPageHandler do
  def init(req, opts) do
    method = :cowboy_req.method(req)
    param = :cowboy_req.binding(:html, req)
    {:ok, resp} = html_example(method, param, req)
    {:ok, resp, opts}
  end

  def html_example("GET", :undefined, req) do
    headers = %{"content-type" => "text/html"}
    body = """
      <html>
        <head>
          <meta charset=\"utf-8\">
                <title>Cowboy Hello!</title>
        </head>
        <body>
          <h1>Undefined HTML file!!</h1>
        </body>
      </html>
    """
    {:ok, _resp} = :cowboy_req.reply(200, headers, body, req)
  end

  def html_example("GET", _param, req) do
    headers = %{"content-type" => "text/html"}
    {:ok, body} = File.read "priv/static/html/index.html"
    {:ok, _resp} = :cowboy_req.reply(200, headers, body, req)
  end
end
