import React from 'react';
import { motion } from 'framer-motion';
import { Timeline } from '@mui/lab';

const TimelineWrapper = ({ 
    items, 
    CardComponent, 
    emptyStateTitle, 
    direction = 'right',
    animationKey 
}) => {
    return (
        <motion.div
            key={animationKey}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
        >
            <Timeline position={direction}>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <CardComponent 
                            key={index} 
                            item={item} 
                            index={index} 
                        />
                    ))
                ) : (
                    <EmptyState title={emptyStateTitle} />
                )}
            </Timeline>
        </motion.div>
    );
};

function EmptyState({ title }) {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg shadow-lg"
        >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">No entries available yet.</p>
        </motion.div>
    );
}

export default React.memo(TimelineWrapper); 