import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Truck, Calendar, Pound } from 'lucide-react';

interface Skip {
  id: string;
  size: string;
  hire_period_days: number;
  price_before_vat: number;
  vat: number;
  description?: string;
  availability?: string;
}

const SkipList: React.FC = () => {
  const [skips, setSkips] = useState<Skip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSkips = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        'https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to ensure we have the required fields
      const transformedData = Array.isArray(data) ? data : data.skips || [];
      const processedSkips = transformedData.map((skip: any, index: number) => ({
        id: skip.id || `skip-${index}`,
        size: skip.size || skip.capacity || 'Unknown',
        hire_period_days: skip.hire_period_days || skip.hirePeriodDays || skip.period || 7,
        price_before_vat: parseFloat(skip.price_before_vat || skip.priceBeforeVat || skip.basePrice || 0),
        vat: parseFloat(skip.vat || skip.vatAmount || skip.tax || 0),
        description: skip.description || skip.desc || '',
        availability: skip.availability || skip.status || 'Available'
      }));
      
      setSkips(processedSkips);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch skip data');
      console.error('Error fetching skips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkips();
  }, []);

  const filteredSkips = skips.filter(skip =>
    skip.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skip.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSizeColor = (size: string) => {
    const sizeNum = parseInt(size);
    if (sizeNum <= 4) return 'bg-green-500';
    if (sizeNum <= 8) return 'bg-yellow-500';
    if (sizeNum <= 12) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatPrice = (priceBeforeVat: number, vat: number) => {
    const total = priceBeforeVat + vat;
    return total.toFixed(2);
  };

  const SkipCard = ({ skip }: { skip: Skip }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${getSizeColor(skip.size)}`}></div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {skip.size} Skip
            </h3>
            {skip.description && (
              <p className="text-sm text-gray-400 mt-1">{skip.description}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">
            £{formatPrice(skip.price_before_vat, skip.vat)}
          </div>
          <div className="text-xs text-gray-500">inc. VAT</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <Truck size={16} className="text-gray-400" />
          <div>
            <div className="text-gray-400">Size</div>
            <div className="text-white font-medium">{skip.size}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-gray-400" />
          <div>
            <div className="text-gray-400">Hire Period</div>
            <div className="text-white font-medium">{skip.hire_period_days} days</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Pound size={16} className="text-gray-400" />
          <div>
            <div className="text-gray-400">Before VAT</div>
            <div className="text-white font-medium">£{skip.price_before_vat.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between text-xs text-gray-400">
          <span>VAT: £{skip.vat.toFixed(2)}</span>
          <span className="text-green-400">{skip.availability}</span>
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
          <div>
            <div className="h-6 bg-gray-600 rounded w-24 mb-2"></div>
            <div className="h-4 bg-gray-600 rounded w-32"></div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-8 bg-gray-600 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-600 rounded w-12"></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-600 rounded w-16"></div>
            <div className="h-5 bg-gray-600 rounded w-12"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-900 text-white overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Skip Hire - Lowestoft (NR32)</h1>
            <p className="text-gray-400 mt-1">Available skips for hire in your area</p>
          </div>
          <button
            onClick={fetchSkips}
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search skips by size or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Content */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle size={48} className="text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Failed to load skip data</h3>
            <p className="text-gray-400 mb-4 text-center max-w-md">{error}</p>
            <button
              onClick={fetchSkips}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : filteredSkips.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400">
                Showing {filteredSkips.length} of {skips.length} skips
              </p>
              <div className="text-sm text-gray-400">
                Total from £{Math.min(...filteredSkips.map(s => s.price_before_vat + s.vat)).toFixed(2)}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkips.map((skip) => (
                <SkipCard key={skip.id} skip={skip} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Truck size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No skips found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkipList;