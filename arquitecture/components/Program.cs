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

Save(new JsonSave("cervezas.json"));

void Save(ISave save)
{
	Console.WriteLine("Iniciando guardado");
	save.Save(cervezas);
	Console.WriteLine("Guardado realizado");
}
