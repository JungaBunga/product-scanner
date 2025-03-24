/**
 * Enhanced scanner service for the Sustainable Shopping Advisor
 */

/**
 * Process the scan result into a standard format
 * @param {string} result - The raw barcode scan result
 * @returns {object} Processed scan result
 */
export const processScanResult = (result) => {
  // Ensure result is a string
  const barcode = String(result).trim();
  
  return {
    barcode,
    isValid: isValidBarcode(barcode),
    timestamp: new Date().toISOString(),
    type: determineCodeType(barcode)
  };
};

/**
 * Check if a barcode is valid
 * @param {string} barcode - The barcode to validate
 * @returns {boolean} True if valid
 */
export const isValidBarcode = (barcode) => {
  if (!barcode || typeof barcode !== 'string') return false;
  
  const cleanBarcode = barcode.trim();
  
  // Check for common product code formats (8-14 digits)
  return /^\d{8,14}$/.test(cleanBarcode);
};

/**
 * Determine the type of barcode
 * @param {string} barcode - The barcode to check
 * @returns {string} The detected barcode type
 */
const determineCodeType = (barcode) => {
  if (!barcode) return 'unknown';
  
  const clean = barcode.trim();
  
  if (/^\d{8}$/.test(clean)) {
    return 'EAN-8';
  } 
  
  if (/^\d{12}$/.test(clean)) {
    return 'UPC-A';
  }
  
  if (/^\d{13}$/.test(clean)) {
    return 'EAN-13';
  }
  
  if (/^\d{14}$/.test(clean)) {
    return 'ITF-14';
  }
  
  return 'other';
};

/**
 * Fetch product information by barcode from Open Food Facts
 * @param {string} barcode - The product barcode
 * @returns {Promise<object>} Product information
 */
export const fetchProductByBarcode = async (barcode) => {
  console.log(`Attempting to fetch product for barcode: ${barcode}`);
  
  // Try to get product from multiple sources
  const sources = [
    { url: `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, name: 'world' },
    { url: `https://uk.openfoodfacts.org/api/v0/product/${barcode}.json`, name: 'uk' },
    { url: `https://us.openfoodfacts.org/api/v0/product/${barcode}.json`, name: 'us' }
  ];
  
  // Try each source until we find the product
  for (const source of sources) {
    try {
      const response = await fetch(source.url);
      
      if (!response.ok) {
        console.warn(`API returned ${response.status} from ${source.name} database`);
        continue;
      }
      
      const data = await response.json();
      console.log(`API Response:`, data);
      
      if (data.status === 1 && data.product) {
        console.log(`Product found in ${source.name} database: ${data.product.product_name}`);
        return formatProductData(data.product, barcode);
      }
    } catch (error) {
      console.error(`Error fetching from ${source.name} database:`, error);
    }
  }
  
  // If we get here, the product wasn't found in any database
  console.log('Product not found in any database');
  return {
    success: false,
    error: 'Product not found in Open Food Facts database'
  };
};

/**
 * Format product data from API into a consistent structure
 * @param {object} productData - Raw product data from API
 * @param {string} barcode - The barcode of the product
 * @returns {object} Formatted product data
 */
const formatProductData = (productData, barcode) => {
  if (!productData) {
    return {
      success: false,
      error: 'Invalid product data'
    };
  }
  
  // Extract image URL, checking multiple possible locations
  const imageUrl = 
    productData.image_url || 
    productData.image_front_url || 
    productData.selected_images?.front?.display?.en || 
    null;
  
  // Format categories to be more readable
  let categories = productData.categories || '';
  if (categories && categories.includes(',')) {
    // Clean up categories that have commas
    categories = categories.split(',')
      .map(cat => cat.trim())
      .filter(cat => cat)
      .join(', ');
  }
  
  // Format ingredients for readability
  let ingredients = productData.ingredients_text || '';
  if (!ingredients && productData.ingredients) {
    // If we have ingredients array but no text, create text from the array
    ingredients = productData.ingredients
      .map(ing => ing.text || ing.id)
      .filter(ing => ing)
      .join(', ');
  }
  
  return {
    success: true,
    product: {
      name: productData.product_name || productData.generic_name || `Product ${barcode}`,
      brand: productData.brands || 'Unknown Brand',
      image: imageUrl,
      ingredients: ingredients,
      nutritionGrade: productData.nutrition_grade_fr || productData.nutriscore_grade || 'unknown',
      packaging: productData.packaging || 'Unknown',
      categories: categories,
      origin_country: productData.origin || productData.countries || '',
      dataSource: 'Open Food Facts'
    }
  };
};

/**
 * Generate a sustainability analysis for a product
 * @param {object} product - The product data
 * @returns {object} Sustainability analysis
 */
export const generateSustainabilityAnalysis = (product) => {
  if (!product) {
    return {
      score: 0,
      rating: 'Unknown',
      analysis: 'No product data available for analysis'
    };
  }
  
  // Extract useful information for sustainability scoring
  const hasOrganicLabel = 
    (product.categories || '').toLowerCase().includes('organic') ||
    (product.name || '').toLowerCase().includes('organic');
    
  const hasFairTradeLabel = 
    (product.categories || '').toLowerCase().includes('fair-trade') ||
    (product.categories || '').toLowerCase().includes('fairtrade');
    
  const isLocalProduct = 
    (product.origin_country || '').toLowerCase().includes('local');
    
  const hasRecyclablePackaging = 
    (product.packaging || '').toLowerCase().includes('glass') ||
    (product.packaging || '').toLowerCase().includes('paper') ||
    (product.packaging || '').toLowerCase().includes('carton');
    
  const hasSingleUsePackaging = 
    (product.packaging || '').toLowerCase().includes('plastic');
  
  // Base score calculation
  let score = 5; // Start at neutral
  
  // Add points for positive factors
  if (hasOrganicLabel) score += 2;
  if (hasFairTradeLabel) score += 1.5;
  if (isLocalProduct) score += 1.5;
  if (hasRecyclablePackaging) score += 1;
  
  // Subtract points for negative factors
  if (hasSingleUsePackaging) score -= 1;
  
  // Nutrition grade bonus/penalty
  if (product.nutritionGrade === 'a' || product.nutritionGrade === 'b') {
    score += 0.5;
  } else if (product.nutritionGrade === 'd' || product.nutritionGrade === 'e') {
    score -= 0.5;
  }
  
  // Cap score between 0-10
  score = Math.max(0, Math.min(10, score));
  
  // Determine rating
  let rating = 'Average';
  if (score >= 8) rating = 'Excellent';
  else if (score >= 6) rating = 'Good';
  else if (score <= 3) rating = 'Poor';
  
  // Generate analysis text
  let analysisText = `This product has a sustainability score of ${score.toFixed(1)}/10 based on available information.`;
  
  // Add specific points to the analysis
  if (hasOrganicLabel) {
    analysisText += ' The product uses organic ingredients, which reduces environmental impact from pesticides and fertilizers.';
  }
  
  if (hasFairTradeLabel) {
    analysisText += ' Fair trade certification ensures ethical treatment and fair compensation for producers.';
  }
  
  if (isLocalProduct) {
    analysisText += ' Locally produced goods typically have a lower carbon footprint from transportation.';
  }
  
  if (hasRecyclablePackaging) {
    analysisText += ' The packaging appears to be recyclable, which is better for waste management.';
  }
  
  if (hasSingleUsePackaging) {
    analysisText += ' Single-use plastic packaging contributes to waste and pollution issues.';
  }
  
  return {
    score: score.toFixed(1),
    rating,
    analysis: analysisText,
    factors: {
      organic: hasOrganicLabel,
      fairTrade: hasFairTradeLabel,
      localOrigin: isLocalProduct,
      recyclablePackaging: hasRecyclablePackaging,
      singleUsePackaging: hasSingleUsePackaging
    }
  };
};