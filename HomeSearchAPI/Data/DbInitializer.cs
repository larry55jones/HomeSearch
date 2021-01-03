using HomeSearchAPI.Entities;

namespace HomeSearchAPI.Data
{
    public static class DbInitializer
    {
        public static void Initialize(HomeSearchDbContext context)
        {
            context.Database.EnsureCreated();
        }
    }
}
