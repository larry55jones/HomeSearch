namespace HomeSearchAPI.Entities
{
    public static class DbInitializer
    {
        public static void Initialize(HomeSearchDbContext context)
        {
            context.Database.EnsureCreated();
        }
    }
}
