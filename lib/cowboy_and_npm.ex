defmodule CowboyAndNpm do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    dispatch = :cowboy_router.compile(routes)
    {:ok, _} = :cowboy.start_clear(:http, 100, [{:port, 4000}],
                                   %{env: %{dispatch: dispatch}})

    # Define workers and child supervisors to be supervised
    children = [
      # Starts a worker by calling: CowboyAndNpm.Worker.start_link(arg1, arg2, arg3)
      # worker(CowboyAndNpm.Worker, [arg1, arg2, arg3]),
      worker(CowboyAndNpm.BrunchWatcher, [],
             id: {"node", "brunch", "watch"},
             restart: :transient)
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: CowboyAndNpm.Supervisor]
    Supervisor.start_link(children, opts)
  end

  defp routes do
    paths = [{"/:html", CowboyAndNpm.TopPageHandler, %{}},
             {"/static/js/:javascript", CowboyAndNpm.JavaScriptHandler, %{}}]
    [{:_, paths}]
  end
end
