using System.Collections.Generic;
using System.IO;
using System.Text.Json;

class JsonSave : ISave
{
    private readonly string _path;

    public JsonSave(string path)
    {
        _path = path;
    }

    public void Save(List<string> items)
    {
        File.WriteAllText(_path, JsonSerializer.Serialize(items));
    }
}
