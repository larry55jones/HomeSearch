using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeSearchAPI.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HomesForSale",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Broker = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PriceInDollars = table.Column<int>(type: "int", nullable: false),
                    BedCount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BathCount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AddressFull = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StreetName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    State = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ZipCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CoverImageURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NewConstruction = table.Column<bool>(type: "bit", nullable: false),
                    DetailPageURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomesForSale", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HomesForSale");
        }
    }
}
