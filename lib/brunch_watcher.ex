defmodule CowboyAndNpm.BrunchWatcher do
  def start_link do
    cmd  = "node"
    args = ["node_modules/brunch/bin/brunch", "watch", "--stdin"]
    opts = [cd: Path.expand("../", __DIR__)]
    Task.start_link(__MODULE__, :watch, [cmd, args, opts])
  end

  def watch(cmd, args, opts) do
    case System.cmd(cmd, args, opts) do
      {message, 0} ->
        IO.puts(message)
        :ok
      {_, _} ->
        Process.sleep(2000)
        exit(:brunch_cmd_error)
    end
  end
end
