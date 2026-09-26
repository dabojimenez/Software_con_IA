List<string> cervezas = new()
{
	"Pilsner",
	"Lager",
	"IPA",
	"Stout",
	"Porter",
	"Weissbier",
	"Pale Ale",
	"Amber Ale",
	"Bock",
	"Saison"
};

Save(new XMLSave("cervezas.xml"));

void Save(ISave save)
{
	Console.WriteLine("Iniciando guardado");
	save.Save(cervezas);
	Console.WriteLine("Guardado realizado");
}
