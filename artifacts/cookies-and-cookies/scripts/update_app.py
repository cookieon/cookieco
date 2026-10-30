import os

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add imports
content = content.replace(
    "import { QueryClient, QueryClientProvider } from '@tanstack/react-query';",
    "import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';\nimport { supabase } from '@/lib/supabase';\nimport AdminPage from '@/pages/Admin';"
)

# 2. Remove hardcoded products array
products_str = """const products: Product[] = [
  { id: 'red-velvet', name: 'Red Velvet', descriptor: 'Massa red velvet, chocolate branco e centro macio derretendo na boca.', price: 15, tag: 'Assinatura', image: redVelvetPhoto },
  { id: 'alpino-black', name: 'Alpino Black', descriptor: 'Chocolate intenso, pedaços rústicos e um recheio cremoso e profundo.', price: 15, tag: 'Bestseller', image: alpinoBlackPhoto },
  { id: 'kinder-bueno', name: 'Kinder Bueno', descriptor: 'Pedaços de avelã, chocolate ao leite belga e uma surpresa no meio.', price: 15, tag: 'Exclusivo', image: kinderBuenoPhoto },
];"""
content = content.replace(products_str, "")

# 3. Update BuildBoxPage signature
content = content.replace(
    "function BuildBoxPage({ onAddToCart }: { onAddToCart: (item: CartItem) => void }) {",
    "function BuildBoxPage({ onAddToCart, products = [] }: { onAddToCart: (item: CartItem) => void; products: Product[] }) {"
)

# 4. Update Home signature
content = content.replace(
    "function Home({ onAddToCart, onMenuOpen }: { onAddToCart: (p: Product) => void; onMenuOpen: () => void }) {",
    "function Home({ onAddToCart, onMenuOpen, products = [] }: { onAddToCart: (p: Product) => void; onMenuOpen: () => void; products: Product[] }) {"
)

# 5. Update AppInner
app_inner_old = """function AppInner() {
  const [items, setItems] = useState<CartItem[]>([]);"""

app_inner_new = """function AppInner() {
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const [items, setItems] = useState<CartItem[]>([]);"""
content = content.replace(app_inner_old, app_inner_new)

# 6. Update Switch inside AppInner
switch_old = """      <Switch>
        <Route path="/" component={() => <Home onAddToCart={addToBag} onMenuOpen={() => setMenuOpen(true)} />} />
        <Route path="/box" component={() => <BuildBoxPage onAddToCart={addToBag} />} />
        <Route component={NotFound} />
      </Switch>"""

switch_new = """      <Switch>
        <Route path="/admin" component={AdminPage} />
        <Route path="/" component={() => <Home onAddToCart={addToBag} onMenuOpen={() => setMenuOpen(true)} products={products} />} />
        <Route path="/box" component={() => <BuildBoxPage onAddToCart={addToBag} products={products} />} />
        <Route component={NotFound} />
      </Switch>"""
content = content.replace(switch_old, switch_new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
