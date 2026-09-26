using System.Collections.Generic;
using System.IO;
using System.Xml.Serialization;

class XMLSave : ISave
{
    private readonly string _path;

    public XMLSave(string path)
    {
        _path = path;
    }

    public void Save(List<string> items)
    {
        var serializer = new XmlSerializer(typeof(List<string>));
        using var writer = new StreamWriter(_path);
        serializer.Serialize(writer, items);
    }
}