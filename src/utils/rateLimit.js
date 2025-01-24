import { LRUCache } from 'lru-cache';

export function rateLimit({
    interval = 60 * 1000, // default: 1 minute
    uniqueTokenPerInterval = 500 // default: max 500 tokens per interval
}) {
    const tokenCache = new LRUCache({
        max: uniqueTokenPerInterval,
        ttl: interval
    });

    return {
        check: async (req, limit) => {
            let ip = req.headers.get('x-forwarded-for') || 'anonymous';
            const tokenCount = tokenCache.get(ip) || [0];
            
            if (tokenCount[0] === 0) {
                tokenCache.set(ip, [1]);
            } else {
                tokenCount[0] += 1;
                
                if (tokenCount[0] > limit) {
                    throw new Error('Rate limit exceeded');
                }

                tokenCache.set(ip, tokenCount);
            }
        }
    };
} 