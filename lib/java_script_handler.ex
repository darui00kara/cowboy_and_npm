defmodule Cowboy2Example.JavaScriptHandler do
  def init(req, opts) do
    method = :cowboy_req.method(req)
    param = :cowboy_req.binding(:javascript, req)
    {:ok, resp} = html_example(method, param, req)
    {:ok, resp, opts}
  end

  def html_example("GET", :undefined, req) do
    headers = %{"content-type" => "text/javascript"}
    body = ""
    {:ok, resp} = :cowboy_req.reply(404, headers, body, req)
  end

  def html_example("GET", param, req) do
    headers = %{"content-type" => "text/javascript"}
    {:ok, js_file} = File.read "priv/static/js/#{param}"
    {:ok, resp} = :cowboy_req.reply(200, headers, js_file, req)
  end
end
